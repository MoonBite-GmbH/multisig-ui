import { BookOpenCheck, LayoutDashboard } from "lucide-react";
import { type NavItem } from "@/types";

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
export const NETWORK_PASSPHRASE: string = "Public Global Stellar Network ; September 2015";

/**
 * The Soroban RPC endpoint used to initialize this library.
 */
export const RPC_URL: string =
  "https://mainnet.stellar.validationcloud.io/v1/YcyPYotN_b6-_656rpr0CabDwlGgkT42NCzPVIqcZh0";

export const DEPLOY_CONTRACT_ID: string =
  "CATZ324BNPPAUPA5ZZZR2UTSTUOWRS2GKGDMIHAN7U5S2CVWLIHUBY3Y";

