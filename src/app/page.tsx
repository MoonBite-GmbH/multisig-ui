"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/Carousel";

import { UserIcon, VoteIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePersistStore } from "@/state/store";
import { getUserMultisigs } from "@/lib/deploy";

export default function Home() {
  const router = useRouter();
  const store = usePersistStore();

  const [multisigEntries, setMultisigEntries] = useState<any[]>([]);
  const [proposalEntries, setProposalEntries] = useState<any[]>([]);

  const init = async () => {
    if (!store.wallet.address) return;

    const _msigs = await getUserMultisigs(store.wallet.address);
    setMultisigEntries(_msigs);
  };

  useEffect(() => {
    init();
  }, [store.wallet.address]);

  useEffect(() => {
    if (!multisigEntries.length) return;

    const _proposalEntries: any[] = [];

    multisigEntries.forEach((msig: any) => {
      msig.proposals.forEach((proposal: any) => {
        _proposalEntries.push({ ...proposal, multisigAddress: msig.address });
      });
    });

    setProposalEntries(_proposalEntries);
  }, [multisigEntries]);

  const hasUserSinged = (signatures: any[]) => {
    const foundSignature = signatures.find(signature => signature[0] === store.wallet.address);
    
    if(foundSignature && foundSignature[1]) {
      return <VoteIcon />;
    }
  }

  return (
    <>
      <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
      <h3 className="text-lg font-semibold mb-4">Multisigs</h3>
      <div className="px-8 mb-8">
        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full"
        >
          <CarouselContent>
            {multisigEntries &&
              multisigEntries.map((msig: any, index: number) => (
                <CarouselItem
                  key={index}
                  className="sm:basis-full md:basis-1/2 lg:basis-1/4"
                  onClick={() => {
                    router.push(`/multisigs/${msig.address}`);
                  }}
                >
                  <div className="p-1">
                    <Card className="cursor-pointer">
                      <CardHeader>
                        <CardTitle>{msig.info.name}</CardTitle>
                        <CardDescription>
                          {msig.info.description}
                        </CardDescription>
                        <CardContent className="pb-0 pt-4">
                        <div className="flex justify-around">
                          <div className="flex">
                            <UserIcon width={20} />
                            <p className="ml-1">{msig.members.length}</p>
                          </div>
                          <div className="flex">
                            <VoteIcon width={20} />
                            <p className="ml-1">{msig.proposals.length}</p>
                          </div>
                        </div>
                      </CardContent>
                      </CardHeader>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>

      <div className="col-span-1 md:col-span-6">
        <h3 className="text-lg font-semibold mb-4">Open Proposals</h3>
        <Card>
          <CardContent>
            <Table>
              <TableCaption>A list of your unvoted proposals.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Satus</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Vote</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {store.wallet.address &&
                  proposalEntries &&
                  proposalEntries.map((proposal: any, index: number) => (
                    proposal.status.tag === "Open" && <TableRow
                      className="cursor-pointer"
                      key={index}
                      onClick={() => {
                        router.push(
                          `/multisigs/${proposal.multisigAddress}/proposals/${Number(proposal.id)}`
                        );
                      }}
                    >
                      <TableCell>{proposal.status.tag}</TableCell>
                      <TableCell className="font-medium">
                        {proposal.proposal.values[0].title}
                      </TableCell>
                      <TableCell>
                        {proposal.proposal.values[0].description}
                      </TableCell>
                      <TableCell className="flex justify-end">
                        {hasUserSinged(proposal.signatures)}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
