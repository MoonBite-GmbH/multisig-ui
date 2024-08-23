"use client";

import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Separator } from "@/components/ui/Separator";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/Table";
import { useMultisig } from "@/hooks/useMultisig";
import { useProposal } from "@/hooks/useProposal";
import { useToast } from "@/components/ui/useToast";
import { executeProposal, signProposal } from "@/lib/multisig";
import { xBull } from "@/lib/wallets/xbull";
import { usePersistStore } from "@/state/store";
import { Check, Cross, VoteIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ToastAction } from "@/components/ui/Toast";
import Link from "next/link";

interface ProposalPageParams {
  readonly params: {
    readonly multisigId: string;
    readonly proposalId: string;
  };
}

interface VotesProps {
  yesVotes: number;
  noVotes: number;
  quorum: number;
}

const Votes = ({ yesVotes, noVotes, quorum }: VotesProps) => {
  const totalVotes = yesVotes + noVotes;
  const yesPercentage = (yesVotes / totalVotes) * 100;
  const quorumPercentage = quorum / 1000;

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-around w-full text-center mb-2">
        <div className="text-green-500 text-xs">Yes: {yesVotes}</div>
        <div className="text-gray-500 text-xs">Quorum: {quorumPercentage}%</div>
        <div className="text-red-500 text-xs">No: {noVotes}</div>
      </div>
      <div className="w-full bg-gray-600 rounded-full h-3 flex relative">
        <div
          className={`bg-green-500 h-full rounded-l-lg ${yesPercentage === 100 && "rounded-r-lg"}`}
          style={{ width: `${yesPercentage}%` }}
        ></div>
        <div
          className="absolute w-1 rounded-sm bg-gray-200"
          style={{
            left: `${quorumPercentage}%`,
            top: "-4px", // Overlaps 3px above the progress bar
            bottom: "-4px", // Overlaps 3px below the progress bar
          }}
        ></div>
      </div>
    </div>
  );
};

const ProposalPage = ({ params }: ProposalPageParams) => {
  const appStore = usePersistStore();
  const { toast } = useToast();

  const [id, setId] = useState<number>(0);
  const [type, setType] = useState<string>("");
  const [sender, setSender] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [proposal, setProposal] = useState<
    | {
        amount: number;
        description: string;
        recipient: string;
        title: string;
        token: string;
      }
    | undefined
  >(undefined);
  const [signatures, setSignatures] = useState<any[]>([]);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [quorum, setQuorum] = useState<number>(0);

  const _proposalInfo = useProposal(params.multisigId, params.proposalId);
  const _multisigInfo = useMultisig(params.multisigId);

  const init = async () => {
    const multisig = await _multisigInfo;
    const { info, signatures, isReady } = await _proposalInfo;

    setQuorum(multisig.info.quorum_bps);

    setId(Number(info.id));
    setType(info.proposal.tag);
    setSender(info.sender);
    setStatus(info.status.tag);

    setSignatures(signatures);
    setIsReady(isReady);

    setProposal({
      //@ts-ignore
      amount: Number(info.proposal.values[0].amount),
      //@ts-ignore
      description: info.proposal.values[0].description,
      //@ts-ignore
      recipient: info.proposal.values[0].recipient,
      //@ts-ignore
      title: info.proposal.values[0].title,
      //@ts-ignore
      token: info.proposal.values[0].token,
    });
  };

  useEffect(() => {
    init();
  }, []);

  const hasUserSinged = (signatures: any[]) => {
    const foundSignature = signatures.find(
      (signature) => signature[0] === appStore.wallet.address
    );

    if (foundSignature && foundSignature[1]) {
      return <VoteIcon />;
    }
  };

  return (
    <>
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 md:col-span-6 lg:col-span-8">
          <h1 className="text-2xl font-semibold mb-4">{proposal?.title}</h1>
          <h2 className="text-xl mb-8">{proposal?.description}</h2>
          <div>
            <h3 className="text-lg font-semibold mb-6">Turnout</h3>
            <Votes
              yesVotes={signatures.filter(([address, signed]) => signed).length}
              noVotes={signatures.filter(([address, signed]) => !signed).length}
              quorum={quorum}
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 mt-8">All Votes</h3>
            <Table className="mb-8">
              <TableBody>
                {signatures?.map((signature: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Link
                        target="__blank"
                        href={`https://stellar.expert/explorer/public/account/${sender}`}
                      >
                        {signature[0]}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {signature[0] ? (
                        <Check width={16} />
                      ) : (
                        <Cross width={16} />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex">
            <Button
              variant="outline"
              className="mr-2"
              onClick={async () => {
                try {
                  const result = await signProposal(
                    new xBull(),
                    appStore.wallet.address!,
                    params.multisigId,
                    params.proposalId
                  );

                  toast({
                    className: cn(
                      "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
                    ),
                    title: "Signed!",
                    description: `You successfully signed the proposal.`,
                  });

                  init();
                } catch (e) {
                  toast({
                    className: cn(
                      "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
                    ),
                    variant: "destructive",
                    title: "Uh oh! Something went wrong.",
                    description: "There was a problem with your request.",
                    action: (
                      <ToastAction altText="Try again">Try again</ToastAction>
                    ),
                  });
                }
              }}
            >
              Sign
            </Button>
            {isReady && (
              <Button
                variant="outline"
                onClick={async () => {
                  try {
                    const result = await executeProposal(
                      new xBull(),
                      appStore.wallet.address!,
                      params.multisigId,
                      params.proposalId
                    );

                    toast({
                      className: cn(
                        "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
                      ),
                      title: "Executed!",
                      description: `You successfully executed the proposal.`,
                    });
                  } catch (e) {
                    toast({
                      className: cn(
                        "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
                      ),
                      variant: "destructive",
                      title: "Uh oh! Something went wrong.",
                      description: "There was a problem with your request.",
                      action: (
                        <ToastAction altText="Try again">Try again</ToastAction>
                      ),
                    });
                  }
                }}
              >
                Execute
              </Button>
            )}
          </div>
        </div>
        <div className="col-span-12 md:col-span-6 lg:col-span-4">
          <Card className="mb-6">
            <CardHeader className="border-b pb-3 pt-3 px-0">
              <div className="grid grid-cols-3 divide-x">
                <div>
                  <p className="flex justify-center mb-2 text-sm text-gray-500">
                    ID
                  </p>
                  <p className="flex justify-center">#{id}</p>
                </div>
                <div>
                  <p className="flex justify-center mb-2 text-sm text-gray-500">
                    Status
                  </p>
                  <p className="flex justify-center">{status}</p>
                </div>
                <div>
                  <p className="flex justify-center mb-2 text-sm text-gray-500">
                    Your Vote
                  </p>
                  <p className="flex justify-center">
                    {hasUserSinged(signatures)}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="mb-4">
                <p className="mb-2 text-sm text-gray-500">Proposer</p>
                <p className="mb-2 hover:underline">
                  <Link
                    target="__blank"
                    href={`https://stellar.expert/explorer/public/account/${sender}`}
                  >
                    {`${sender.slice(0, 4)}...${sender.slice(-4)}`}
                  </Link>
                </p>
                <Separator />
              </div>
              <div className="mb-4">
                <p className="mb-2 text-sm text-gray-500">Type</p>
                <p className="mb-2">{type}</p>
                <Separator />
              </div>
              <div className="mb-4">
                <p className="mb-2 text-sm text-gray-500">Amount</p>
                <p className="mb-2">{proposal?.amount}</p>
                <Separator />
              </div>
              <div>
                <p className="mb-2 text-sm text-gray-500">Token</p>
                <p className="hover:underline">
                  <Link
                    target="__blank"
                    href={`https://stellar.expert/explorer/public/contract/${proposal?.token}`}
                  >
                    {`${proposal?.token.slice(0, 4)}...${proposal?.token.slice(-4)}`}
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default ProposalPage;
