"use client";

import { getUserMultisigs } from "@/lib/deploy";
import { usePersistStore } from "@/state/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function MultisigsPage() {
  const store = usePersistStore();
  const router = useRouter();

  const [entries, setEntries] = useState<any[]>([]);

  const init = async () => {
    if(!store.wallet.address) return;

    const _msigs = await getUserMultisigs(store.wallet.address);
    setEntries(_msigs);
  };

  useEffect(() => {
    init();
  }, [store.wallet.address]);

  return (
    <>
      <h1 className="text-2xl font-semibold mb-4">Multisigs</h1>
      {entries.map((entry: any, index: number) => (
        <div key={index}>{entry.info.name}</div>
      ))}
    </>
  );
}
