"use client";
import { useMultisig } from "@/hooks/useMultisig";
import { useEffect, useState } from "react";
import * as MultisigContract from "@/lib/contract";
import { Proposal } from "@/lib/contract";
import { NETWORK_PASSPHRASE, RPC_URL } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import Link from "next/link";

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
    setProposals(sigInfo.proposals);
  };
  useEffect(() => {
    init();
  }, []);
  return (
    <>
      {info && (
        <div>
          <div className="mx-auto">
            <h1 className="text-2xl font-semibold mb-4">{info.name}</h1>
            <h2 className="text-xl mb-8 text-muted-foreground">
              {info.description}
            </h2>
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3">Members</h3>
              {members.map((member, index) => (
                <p key={index} className="mb-2 truncate">
                  <Link
                    target="__blank"
                    className="text-sm hover:underline"
                    href={`https://stellar.expert/explorer/public/account/${member}`}
                  >
                    {member}
                  </Link>
                </p>
              ))}
            </div>
            <div className="flex justify-between mb-3">
              <h3 className="text-lg font-semibold">Proposals</h3>
              <Button
                onClick={() => {
                  router.push(
                    `/multisigs/${params.multisigId}/proposals/create`
                  );
                }}
              >
                Create Proposal
              </Button>
            </div>
            <div className="overflow-x-auto xl:block hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[60px]">ID</TableHead>
                    <TableHead className="w-[80px]">Status</TableHead>
                    <TableHead className="w-[90px]">Expiration</TableHead>
                    <TableHead className="w-[100px]">Type</TableHead>
                    <TableHead>Title</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {proposals.map((entry, index) => (
                    <TableRow
                      key={index}
                      className="cursor-pointer"
                      onClick={() => {
                        router.push(
                          `/multisigs/${params.multisigId}/proposals/${entry.id}`
                        );
                      }}
                    >
                      <TableCell>{Number(entry.id)}</TableCell>
                      <TableCell
                        className={`text-sm ${entry.status.tag === "Open" ? "text-green-700" : "text-orange-700"}`}
                      >
                        {entry.status.tag}
                      </TableCell>
                      <TableCell>
                        {new Date(
                          Number(entry.expiration_timestamp) * 1000
                        ).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{entry.proposal.tag}</TableCell>
                      <TableCell>{(entry.proposal.values[0] as any).title}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="block xl:hidden">
              {proposals.map((entry, index) => (
                <div key={index} className="mb-1 p-3 border rounded">
                  <div className="flex mb-4 items-center">
                    <p className="text-sm font-bold mr-4">{Number(entry.id)}</p>
                    <p>{(entry.proposal.values[0] as any).title}</p>
                  </div>
                  <div className="flex justify-between">
                    <p
                      className={`text-sm ${entry.status.tag === "Open" ? "text-green-700" : "text-orange-700"}`}
                    >
                      {entry.status.tag}
                    </p>
                    <p>
                      {new Date(
                        Number(entry.expiration_timestamp) * 1000
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MultisigPage;
