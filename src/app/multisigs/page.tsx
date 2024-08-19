"use client";

import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Pencil } from "lucide-react";

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

    console.log(_msigs)
  };

  useEffect(() => {
    init();
  }, [store.wallet.address]);

  return (
    <>
      <Button
        onClick={() => {
          router.push("/multisigs/create");
        }}
      >
        Create Multisig
      </Button>
      <h1 className="text-2xl font-semibold mb-4">Multisigs</h1>
      <div className="grid grid-cols-5 gap-4">
        {entries.map((entry: any, index: number) => (
          <Card key={index} className="cursor-pointer" onClick={() => {router.push(`/multisigs/${entry.address}`)}}>
            <CardHeader>
              <CardTitle>{entry.info.name}</CardTitle>
              <CardDescription>{entry.info.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </>
  );
}
