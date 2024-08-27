import { BookOpenCheck, LayoutDashboard, PlusIcon } from "lucide-react";
import { type NavItem } from "@/types";
import { Account } from "@stellar/stellar-sdk";

export const NavItems: NavItem[] = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/",
    color: "text-sky-500",
  },
  {
    title: "Multisigs",
    icon: BookOpenCheck,
    href: "/multisigs",
    color: "text-orange-500",
  },
];

/**
 * The Soroban network passphrase used to initialize this library.
 */
export const NETWORK_PASSPHRASE: string = "Test SDF Network ; September 2015";

/**
 * The Soroban RPC endpoint used to initialize this library.
 */
export const RPC_URL: string =
  "https://soroban-testnet.stellar.org/";

export const DEPLOY_CONTRACT_ID: string =
  "CAAJNRGWI6HZLN56SVBTMTZV3VIY72A4CLCX4D4DMGE6C2ACFRPOWSZL";

