"use client";

interface ProposalPageParams {
  readonly params: {
    readonly multisigId: string;
    readonly proposalId: string;
  };
}

const ProposalPage = ({ params }: ProposalPageParams) => {
  return (
    <div>Proposal Page {params.multisigId} {params.proposalId}</div>
  );
};

export default ProposalPage;
