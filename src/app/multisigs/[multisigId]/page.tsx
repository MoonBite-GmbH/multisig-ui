"use client";
import { useMultisig } from "@/hooks/useMultisig";
import { useEffect, useState } from "react";
import * as MultisigContract from "@/lib/contract";
import { Proposal } from "@/lib/contract";
import { NETWORK_PASSPHRASE, RPC_URL } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";

interface MultisigPageParams {
  readonly params: {
    readonly multisigId: string;
  };
}

interface VotesProps {
  yesVotes: number;
  noVotes: number;
  abstainVotes: number;
}

const Votes = ({ yesVotes, noVotes, abstainVotes }: VotesProps) => {
  const totalVotes = yesVotes + noVotes + abstainVotes;
  const yesPercentage = (yesVotes / totalVotes) * 100;
  const noPercentage = (noVotes / totalVotes) * 100;

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-around w-full text-center mb-2">
        <div className="text-green-500 text-xs">Yes: {yesVotes}</div>
        <div className="text-gray-500 text-xs">Abstain: {abstainVotes}</div>
        <div className="text-red-500 text-xs">No: {noVotes}</div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-4 flex overflow-hidden">
        <div
          className="bg-green-500 h-full"
          style={{ width: `${yesPercentage}%` }}
        ></div>
        <div
          className="bg-red-500 h-full"
          style={{ width: `${noPercentage}%` }}
        ></div>
      </div>
    </div>
  );
};

const MultisigPage = ({ params }: MultisigPageParams) => {
  const router = useRouter();

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
    if (latestProposal == 0) {
      return;
    }

    const _proposals = (await msigClient.query_all_proposals()).result;

    setProposals(_proposals);
  };
  useEffect(() => {
    init();
  }, []);
  return (
    <>
      {info && (
        <div>
          <div className="mx-auto">
            <div className="space-y-2">
              <h1>Multisig {info.name}</h1>
              <p>{info.description}</p>
              <Button
                onClick={() => {
                  router.push(
                    `/multisigs/${params.multisigId}/proposals/create`
                  );
                }}
              >
                Create Proposal
              </Button>
              <h1 className="text-2xl font-semibold mb-4">Proposals</h1>
              <div className="overflow-x-auto xl:block hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Proposal ID</TableHead>
                      <TableHead className="w-[100px]">Sender</TableHead>
                      <TableHead className="w-[200px]">Type</TableHead>
                      <TableHead className="w-[200px]">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {proposals.map((entry, index) => (
                      <TableRow
                        key={index}
                        onClick={() => {
                          router.push(`/multisigs/${params.multisigId}/proposals/${index}`);
                        }}
                      >
                        <TableCell>{Number(entry.id)}</TableCell>
                        <TableCell>{entry.sender}</TableCell>
                        <TableCell>{entry.proposal.tag}</TableCell>
                        <TableCell
                          className={`text-sm ${entry.status.tag === "Open" ? "text-green-700" : "text-orange-700"}`}
                        >
                          {entry.status.tag}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="block xl:hidden">
                {proposals.map((entry, index) => (
                  <div key={index} className="mb-1 p-3 border rounded">
                    <div className="flex justify-between mb-4">
                      <p className="text-sm font-bold">{Number(entry.id)}</p>
                      <p className="text-sm">{entry.proposal.tag}</p>
                      <p
                        className={`text-sm ${entry.status.tag === "Open" ? "text-green-700" : "text-orange-700"}`}
                      >
                        {entry.status.tag}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MultisigPage;
