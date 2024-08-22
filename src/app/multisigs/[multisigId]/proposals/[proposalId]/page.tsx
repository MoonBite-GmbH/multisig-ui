"use client";

import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Separator } from "@/components/ui/Separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { useProposal } from "@/hooks/useProposal";
import { Proposal } from "@/lib/contract";
import { executeProposal, signProposal } from "@/lib/multisig";
import { xBull } from "@/lib/wallets/xbull";
import { usePersistStore } from "@/state/store";
import { Check, Cross, VoteIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface ProposalPageParams {
  readonly params: {
    readonly multisigId: string;
    readonly proposalId: string;
  };
}

const ProposalPage = ({ params }: ProposalPageParams) => {
  const appStore = usePersistStore();

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

  const _proposalInfo = useProposal(params.multisigId, params.proposalId);

  const init = async () => {
    const { info, signatures, isReady } = await _proposalInfo;

    console.log(info);

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
            <h3 className="text-lg font-semibold mb-4">Turnout</h3>

          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">All Votes</h3>
            <Table className="mb-8">
              <TableBody>
                {signatures?.map((signature: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell>
                      {signature[0]}
                    </TableCell>
                    <TableCell>
                      {signature[0] ? <Check width={16}/> : <Cross width={16}/>}
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
                const result = await signProposal(
                  new xBull(),
                  appStore.wallet.address!,
                  params.multisigId,
                  params.proposalId
                );

                console.log(result);
              }}
            >
              Sign
            </Button>
            {isReady && (
              <Button
                variant="outline"
                onClick={async () => {
                  const result = await executeProposal(
                    new xBull(),
                    appStore.wallet.address!,
                    params.multisigId,
                    params.proposalId
                  );

                  console.log(result);
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
                  <p className="flex justify-center mb-2 text-sm">ID</p>
                  <p className="flex justify-center">#{id}</p>
                </div>
                <div>
                  <p className="flex justify-center mb-2 text-sm">Status</p>
                  <p className="flex justify-center">{status}</p>
                </div>
                <div>
                  <p className="flex justify-center mb-2 text-sm">Your Vote</p>
                  <p className="flex justify-center">
                    {hasUserSinged(signatures)}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="mb-4">
                <p className="mb-2 text-sm">Proposer</p>
                <p className="">{`${sender.slice(0, 4)}...${sender.slice(-4)}`}</p>
              </div>
              <div className="mb-4">
                <p className="mb-2 text-sm">Type</p>
                <p className="">{type}</p>
              </div>
              <div className="mb-4">
                <p className="mb-2 text-sm">Amount</p>
                <p className="">{proposal?.amount}</p>
              </div>
              <div>
                <p className="mb-2 text-sm">Token</p>
                <p className="">{`${proposal?.token.slice(0, 4)}...${proposal?.token.slice(-4)}`}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default ProposalPage;
