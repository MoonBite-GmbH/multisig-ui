"use client";
import { useMultisig } from "@/hooks/useMultisig";
import { useEffect, useState } from "react";
import * as MultisigContract from "@/lib/contract";
import { Proposal } from "@/lib/contract";
import { NETWORK_PASSPHRASE, RPC_URL } from "@/lib/constants";

interface MultisigPageParams {
  readonly params: {
    readonly multisigId: string;
  };
}

const MultisigPage = ({ params }: MultisigPageParams) => {
  const [members, setMembers] = useState<string[]>([]);
  const [info, setInfo] = useState<any>();
  const [proposals, setProposals] = useState<Proposal[]>([]);

  const _msig = useMultisig(params.multisigId);

  const init = async () => {
    const sigInfo = await _msig;
    setInfo(sigInfo.info);
    setMembers(sigInfo.members);

    // Here comes the tricky part, as we can't iterate through proposals on that msig
    // Need to fetch the latest ID. If the latest ID is 0, there are non proposals.
    // If it's higher then 0, we need to query each proposal from the multisig
    const msigClient = new MultisigContract.Client({
      contractId: params.multisigId,
      rpcUrl: RPC_URL,
      networkPassphrase: NETWORK_PASSPHRASE,
    });

    // Query latest
    const latestProposal = (await msigClient.query_last_proposal_id()).result;

    // If there are no proposals
    if (latestProposal === 0) {
      return;
    }

    let _proposals = [];

    // If there is 1 or more, we need to query proposals
    for (let i = 1; i++; i <= latestProposal) {
      const proposal = (await msigClient.query_proposal({ proposal_id: i }))
        .result;
      _proposals.push(proposal!);
    }
    setProposals(_proposals);
  };
  useEffect(() => {
    init();
  }, []);
  return (
    <>
      {info && (
        <div>
          <div className="max-w-2xl mx-auto">
            <div className="space-y-2">
              <h1>Multisig {info.name}</h1>
              <p>{info.description}</p>
              <div className="flex items-center justify-between p-4 rounded-lg border-2">
                <div className="flex items-center">
                  <div className="text-green-500 mr-2">✔</div>
                  <div>
                    <div className="text-sm text-gray-400">#1</div>
                    <div className="font-bold">Gaia v17 Software Upgrade</div>
                  </div>
                </div>
                <div className="text-gray-400 text-sm">31. Mai</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MultisigPage;
