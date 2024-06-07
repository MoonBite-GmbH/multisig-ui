import { cn } from "@/lib/utils";
import { MobileSidebar } from "@/components/layout/MobileSidebar";
import Link from "next/link";
import { Boxes } from "lucide-react";
import { UserNav } from "@/components/layout/UserNav";
import { Button } from "@/components/ui/Button";
import { ThemeToggler } from "@/components/ui/ThemeToggler";

export default function Header() {
  return (
    <div className="supports-backdrop-blur:bg-background/60 fixed left-0 right-0 top-0 z-20 border-b bg-background/95 backdrop-blur">
      <nav className="flex h-16 items-center justify-between px-4">
        <Link
          href={"/"}
          className="hidden items-center justify-between gap-2 md:flex"
        >
          <Boxes className="h-6 w-6" />
          <h1 className="text-lg font-semibold">Sorosig</h1>
        </Link>
        <div className={cn("block md:!hidden")}>
          <MobileSidebar />
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggler />
          {/* TODO */}
          {false ? <UserNav /> : <Button size="sm">Sign In</Button>}
        </div>
      </nav>
    </div>
  );
}
