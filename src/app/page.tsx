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

import { PlusIcon, VoteIcon } from "lucide-react";
import { useUserMultisigs } from "@/hooks/useMultisig";
import { useEffect, useState } from "react";

export default function Home() {
  const [msigData, setMsigData] = useState<any>();

  const notification = {
    title: "There are 4 new proposals to review!",
    description: "1 hour ago",
  };

  const _msigData = useUserMultisigs();

  const setData = async () => {
    setMsigData(await _msigData);
  };
  useEffect(() => {
    setData();
  }, [_msigData]);

  return (
    <>
      <p className="text-2xl font-semibold">My Sorosigs</p>
      <div className="grid grid-cols-1 md:grid-cols-10 gap-4">
        {msigData &&
          msigData.map((msig: any) => (
            <div
              key={msig.info.title}
              className="grid grid-cols-1 gap-4 md:grid-cols-2 mt-4 col-span-1 md:col-span-7"
            >
              <Card>
                <CardHeader>
                  <CardTitle>{msig.info.name}</CardTitle>
                  <CardDescription>{msig.info.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div>
                    <div className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
                      <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {notification.title}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {notification.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Need another Sorosig?</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <PlusIcon />
                    <p>Create new multisig!</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}

        <div className="col-span-1 md:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>New Proposals</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableCaption>A list of your unvoted proposals.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Multisig</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead className="text-right">Vote</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      My awesome Sorosig
                    </TableCell>
                    <TableCell>Pending</TableCell>
                    <TableCell>How many eggs should we cook tonight?</TableCell>
                    <TableCell className="text-right">
                      <VoteIcon />
                    </TableCell>
                  </TableRow>
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={3}>Total Unvoted</TableCell>
                    <TableCell className="text-right">1</TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
