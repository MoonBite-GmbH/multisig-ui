"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { useRouter } from "next/navigation";
import { use, useState } from "react";

interface VotesProps {
  yesVotes: number;
  noVotes: number;
  abstainVotes: number;
}

interface Proposal {
  id: number;
  status: "PASSED" | "REJECTED" | "ONGOING";
  title: string;
  expiration: string;
  votes: VotesProps;
  quorum: number;
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

export default function Proposals() {
  const router = useRouter();

  const [entries, setEntries] = useState<Proposal[]>([
    {
      id: 1,
      status: "PASSED",
      title:
        "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua",
      expiration: "10.08.2024",
      votes: {
        yesVotes: 3,
        noVotes: 2,
        abstainVotes: 1,
      },
      quorum: 32.35,
    },
  ]);

  return (
    <>
      <h1 className="text-2xl font-semibold mb-4">Proposals</h1>
      <div className="overflow-x-auto xl:block hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Proposal ID</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="w-[200px]">Expiration</TableHead>
              <TableHead className="w-[300px]">Votes</TableHead>
              <TableHead className="text-right w-[200px]">Quorum</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry, index) => (
              <TableRow
                key={index}
                onClick={() => {
                  router.push(`/multisigs/${entry.id}`);
                }}
              >
                <TableCell>{entry.id}</TableCell>
                <TableCell
                  className={`text-sm ${entry.status === "PASSED" ? "text-green-700" : entry.status === "REJECTED" ? "text-red-700" : "text-orange-700"}`}
                >
                  {entry.status}
                </TableCell>
                <TableCell>{entry.title}</TableCell>
                <TableCell>{entry.expiration}</TableCell>
                <TableCell>
                  <Votes {...entry.votes} />
                </TableCell>
                <TableCell>
                  <div className="flex align-middle justify-end">
                    <div
                      className={`${entry.quorum > 30 ? "text-green-700" : "text-red-700"}`}
                    >
                      {entry.quorum}%
                    </div>
                    <div className="ml-1">/ 30%</div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="block xl:hidden">
        {entries.map((entry, index) => (
          <div key={index} className="mb-1 p-3 border rounded">
            <div className="flex justify-between mb-4">
              <p className="text-sm font-bold">{entry.id}</p>
              <p
                className={`text-sm ${entry.status === "PASSED" ? "text-green-700" : entry.status === "REJECTED" ? "text-red-700" : "text-orange-700"}`}
              >
                {entry.status}
              </p>
            </div>
            <p className="text-sm mb-6">{entry.title}</p>
            <div className="mb-6">
              <Votes {...entry.votes} />
            </div>
            <div className="flex justify-between">
              <p className="text-sm">{entry.expiration}</p>
              <div className="flex align-middle justify-end">
                <div
                  className={`text-sm ${entry.quorum > 30 ? "text-green-700" : "text-red-700"}`}
                >
                  {entry.quorum}%
                </div>
                <div className="ml-1 text-sm">/ 30%</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
