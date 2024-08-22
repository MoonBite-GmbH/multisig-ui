"use client";

import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { useProposal } from "@/hooks/useProposal";
import { Proposal } from "@/lib/contract";
import { executeProposal, signProposal } from "@/lib/multisig";
import { xBull } from "@/lib/wallets/xbull";
import { usePersistStore } from "@/state/store";
import { VoteIcon } from "lucide-react";
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

    console.log(info)

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
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-6 lg:col-span-8">
          <h1 className="text-2xl font-semibold mb-4">{proposal?.title}</h1>
          <h2 className="text-xl font-semibold mb-4">
            {proposal?.description}
          </h2>
        </div>
        <div className="col-span-12 md:col-span-6 lg:col-span-4">
          <div className="flex w-full justify-start md:justify-end mb-4">
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
          <Card>
            <CardHeader className="border-b pb-3 pt-3 px-0">
              <div className="grid grid-cols-3 divide-x">
                <div>
                  <p className="flex justify-center mb-2 text-sm">
                    ID
                  </p>
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
            </CardContent>
          </Card>
        </div>
      </div>

      {proposal && (
        <>
          <div>ID: {id}</div>
          <div>Type: {type}</div>
          <div>Sender: {sender}</div>
          <div>Status: {status}</div>
          <div>Amount: {proposal.amount}</div>
          <div>Title: {proposal.title}</div>
          <div>Description: {proposal.description}</div>
          <div>Token: {proposal.token}</div>
        </>
      )}
    </>
  );
};

export default ProposalPage;
