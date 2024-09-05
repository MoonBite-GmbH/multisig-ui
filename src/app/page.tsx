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
import { Skeleton } from "@/components/ui/Skeleton";

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
      console.log(msig);
      msig.proposals.forEach((proposal: any) => {
        _proposalEntries.push({
          ...proposal,
          multisigAddress: msig.address,
          multisigName: msig.info.name,
        });
      });
    });

    setProposalEntries(_proposalEntries);
  }, [multisigEntries]);

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
            {multisigEntries?.length ? (
              multisigEntries.map((msig: any, index: number) => (
                <CarouselItem
                  key={index}
                  className="sm:basis-full md:basis-1/2 lg:basis-1/4 xl:basis-1/5"
                  onClick={() => {
                    router.push(`/multisigs/${msig.address}`);
                  }}
                >
                  <div className="p-1">
                    <Card className="cursor-pointer">
                      <CardHeader>
                        <CardTitle>{msig.info.name}</CardTitle>
                        <CardDescription className="line-clamp-2">
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
              ))
            ) : (
              <>
                <CarouselItem className="sm:basis-full md:basis-1/2 lg:basis-1/4 xl:basis-1/5">
                  <div className="p-1">
                    <Skeleton className="h-[136px] w-full rounded-xl" />
                  </div>
                </CarouselItem>
                <CarouselItem className="sm:basis-full md:basis-1/2 lg:basis-1/4 xl:basis-1/5">
                  <div className="p-1">
                    <Skeleton className="h-[136px] w-full rounded-xl" />
                  </div>
                </CarouselItem>
                <CarouselItem className="sm:basis-full md:basis-1/2 lg:basis-1/4 xl:basis-1/5">
                  <div className="p-1">
                    <Skeleton className="h-[136px] w-full rounded-xl" />
                  </div>
                </CarouselItem>
                <CarouselItem className="sm:basis-full md:basis-1/2 lg:basis-1/4 xl:basis-1/5">
                  <div className="p-1">
                    <Skeleton className="h-[136px] w-full rounded-xl" />
                  </div>
                </CarouselItem>
                <CarouselItem className="sm:basis-full md:basis-1/2 lg:basis-1/4 xl:basis-1/5">
                  <div className="p-1">
                    <Skeleton className="h-[136px] w-full rounded-xl" />
                  </div>
                </CarouselItem>
              </>
            )}
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
                  <TableHead className="w-[90px]">Expiration</TableHead>
                  <TableHead className="w-[100px]">Type</TableHead>
                  <TableHead>Multisig</TableHead>
                  <TableHead>Title</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {store.wallet.address && proposalEntries ? (
                  proposalEntries.map(
                    (proposal: any, index: number) =>
                      proposal.status.tag === "Open" && (
                        <TableRow
                          className="cursor-pointer"
                          key={index}
                          onClick={() => {
                            router.push(
                              `/multisigs/${proposal.multisigAddress}/proposals/${Number(proposal.id)}`
                            );
                          }}
                        >
                          <TableCell className="font-medium">
                            {new Date(
                              Number(proposal.expiration_timestamp) * 1000
                            ).toLocaleDateString()}
                          </TableCell>
                          <TableCell>{proposal.proposal.tag}</TableCell>
                          <TableCell>{proposal.multisigName}</TableCell>
                          <TableCell>
                            {proposal.proposal.values[0].title}
                          </TableCell>
                        </TableRow>
                      )
                  )
                ) : (
                  <>
                    <TableRow className="relative h-[35px]">
                      <TableCell className="absolute h-[35px] w-full">
                        <Skeleton className="h-full w-full rounded-sm" />
                      </TableCell>
                    </TableRow>
                    <TableRow className="relative h-[35px]">
                      <TableCell className="absolute h-[35px] w-full">
                        <Skeleton className="h-full w-full rounded-sm" />
                      </TableCell>
                    </TableRow>
                    <TableRow className="relative h-[35px]">
                      <TableCell className="absolute h-[35px] w-full">
                        <Skeleton className="h-full w-full rounded-sm" />
                      </TableCell>
                    </TableRow>
                    <TableRow className="relative h-[35px]">
                      <TableCell className="absolute h-[35px] w-full">
                        <Skeleton className="h-full w-full rounded-sm" />
                      </TableCell>
                    </TableRow>
                  </>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
