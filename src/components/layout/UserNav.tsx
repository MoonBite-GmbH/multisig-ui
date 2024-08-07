"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { Button } from "@/components/ui/Button";
import { LogOut } from "lucide-react";
import { UserAvatar } from "@/components/layout/UserAvatar";
import { usePersistStore } from "@/state/store";

export function UserNav() {
  const storePersist = usePersistStore();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar className="h-8 w-8 cursor-pointer" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="flex items-center justify-start gap-4 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {storePersist.wallet.address}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => storePersist.disconnectWallet()}
          >
            <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
            Log Out
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
