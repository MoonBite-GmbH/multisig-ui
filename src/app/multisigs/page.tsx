"use client";

import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Pencil, UserIcon, VoteIcon } from "lucide-react";

import { getUserMultisigs } from "@/lib/deploy";
import { usePersistStore } from "@/state/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function MultisigsPage() {
  const store = usePersistStore();
  const router = useRouter();

  const [entries, setEntries] = useState<any[]>([]);

  const init = async () => {
    if (!store.wallet.address) return;

    const _msigs = await getUserMultisigs(store.wallet.address);
    setEntries(_msigs);

    console.log(_msigs);
  };

  useEffect(() => {
    init();
  }, [store.wallet.address]);

  return (
    <>
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-semibold">Multisigs</h1>
        <Button
          onClick={() => {
            router.push("/multisigs/create");
          }}
        >
          Create Multisig
        </Button>
      </div>
      <div className="grid lg:grid-cols-5 md:grid-cols-3 gap-4">
        {entries.map((entry: any, index: number) => (
          <Card
            key={index}
            className="cursor-pointer"
            onClick={() => {
              router.push(`/multisigs/${entry.address}`);
            }}
          >
            <CardHeader>
              <CardTitle className="truncate mb-2">{entry.info.name}</CardTitle>
              <CardDescription className="line-clamp-2 h-11">
                {entry.info.description}
              </CardDescription>
              <CardContent className="pb-0 pt-4">
                <div className="flex justify-around">
                  <div className="flex">
                    <UserIcon width={20} />
                    <p className="ml-1">{entry.members.length}</p>
                  </div>
                  <div className="flex">
                    <VoteIcon width={20} />
                    <p className="ml-1">{entry.proposals.length}</p>
                  </div>
                </div>
              </CardContent>
            </CardHeader>
          </Card>
        ))}
      </div>
    </>
  );
}
