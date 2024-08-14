"use client";

import { Button } from "@/components/ui/Button";
import { useProposal } from "@/hooks/useProposal";
import { Proposal } from "@/lib/contract";
import { signProposal } from "@/lib/multisig";
import { xBull } from "@/lib/wallets/xbull";
import { usePersistStore } from "@/state/store";
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
  const [proposal, setProposal] = useState<{amount: number, description: string, recipient: string, title: string, token: string} | undefined>(undefined)

  const _proposalInfo = useProposal(params.multisigId, params.proposalId);

  const init = async () => {
    const proposalInfo = await _proposalInfo;
    
    setId(Number(proposalInfo.id));
    setType(proposalInfo.proposal.tag);
    setSender(proposalInfo.sender);
    setStatus(proposalInfo.status.tag);

    setProposal({
      //@ts-ignore
      amount: Number(proposalInfo.proposal.values[0].amount),
      //@ts-ignore
      description: proposalInfo.proposal.values[0].description,
      //@ts-ignore
      recipient: proposalInfo.proposal.values[0].recipient,
      //@ts-ignore
      title: proposalInfo.proposal.values[0].title,
      //@ts-ignore
      token: proposalInfo.proposal.values[0].token,
    });
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <>
    <Button onClick={async () => {
      const result = await signProposal(
        new xBull(),
        appStore.wallet.address!,
        params.multisigId,
        params.proposalId
      );

      console.log(result)
    }}>Sign</Button>
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
