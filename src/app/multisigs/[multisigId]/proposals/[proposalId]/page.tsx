"use client";

import { Button } from "@/components/ui/Button";
import { useProposal } from "@/hooks/useProposal";
import { signProposal } from "@/lib/multisig";
import { xBull } from "@/lib/wallets/xbull";
import { usePersistStore } from "@/state/store";
import { useEffect } from "react";

interface ProposalPageParams {
  readonly params: {
    readonly multisigId: string;
    readonly proposalId: string;
  };
}

const ProposalPage = ({ params }: ProposalPageParams) => {
  const appStore = usePersistStore();

  const _proposal = useProposal(params.multisigId, params.proposalId);

  const init = async () => {
    const proposal = await _proposal;
    console.log(proposal)
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
    </>
  );
};

export default ProposalPage;
