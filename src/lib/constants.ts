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
    title: "Proposals",
    icon: BookOpenCheck,
    href: "/proposals",
    color: "text-green-500",
  },
  {
    title: "Multisigs",
    icon: BookOpenCheck,
    href: "/multisigs",
    color: "text-orange-500",
  },
];

export const TESTING_SOURCE: Account = new Account(
  "GBUHRWJBXS4YAEOVDRWFW6ZC5LLF2SAOMATH4I6YOTZYHE65FQRFOKG2",
  "1",
);

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
  "CAERBL6MW3K5DWZQWLPV24PLAD63IBWZ5QKABHPUWCMM4IMMGV6WPMZG";

// TODO: Fetch multisigs from the api, for now we will use this hardcoded list
export const MULTISIGS = [
  "CCZ7IPQPGPV4JF6TROB7MWEAFBWEQDOLXNFIN3XAXT3JZR3EVCWJ77AW",
  "CCJT7H7JZ5EDV5FIJMKKGBVBOR2OGEURELD7HINKGTKNOBRW6HHR5WNU"
];
