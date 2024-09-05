import { Horizon } from "@stellar/stellar-sdk";

interface GeneralStore {
  server: Horizon.Server;
  networkPassphrase: string;
}

export interface LayoutActions {
  walletModalOpen: boolean;
  setWalletModalOpen: (open: boolean) => void;
  tourRunning: boolean;
  setTourRunning: (running: boolean) => void;
  tourStep: number;
  setTourStep: (step: number) => void;
}

export type AppStore = WalletActions & LayoutActions & GeneralStore;

export type AppStorePersist = PersistWalletActions;

export type SetStateType = (
  partial:
    | AppStore
    | Partial<AppStore>
    | ((state: AppStore) => AppStore | Partial<AppStore>),
  replace?: boolean | undefined,
) => void;

export type GetStateType = () => AppStore;

export interface PersistWalletActions {
  connectWallet: (wallet: string) => Promise<void>;
  disconnectWallet: () => void;
  wallet: Wallet;
}

export type StateToken = {
  id: string;
  balance: bigint;
  decimals: number;
  symbol: string;
  isStakingToken?: boolean;
};

export type Wallet = {
  address: string | undefined;
  activeChain: WalletChain | undefined;
  server: Horizon.Server | undefined;
  walletType: "freighter" | "xbull" | "lobstr" | undefined;
};

export interface WalletActions {
  tokens: StateToken[];
  allTokens: any;
  fetchTokenInfo: (
    tokenAddress: string,
    isStakingToken?: boolean,
  ) => Promise<StateToken | undefined>;
  getAllTokens: () => Promise<any[]>;
}

export interface WalletChain {
  id: string;
  name?: string;
  networkPassphrase: string;
  iconBackground?: string;
  iconUrl?: string | null;
  // TODO: Use this to indicate which chains a dapp supports
  unsupported?: boolean;
}

export type Connector = {
  id: string;
  name: string;
  shortName?: string;
  iconUrl: string;
  iconBackground: string;
  installed?: boolean;
  downloadUrls?: {
    android?: string;
    ios?: string;
    browserExtension?: string;
    qrCode?: string;
  };
  isConnected: () => boolean | Promise<boolean>;
  getNetworkDetails: () => Promise<NetworkDetails>;
  getPublicKey: () => Promise<string>;
  signTransaction: (
    xdr: string,
    opts?: {
      network?: string;
      networkPassphrase?: string;
      accountToSign?: string;
    },
  ) => Promise<string>;
};

export type InstructionStepName = "install" | "create" | "scan";

export interface NetworkDetails {
  network: string;
  networkUrl: string;
  networkPassphrase: string;
}

// Sourced from https://github.com/tmm/wagmi/blob/main/packages/core/src/constants/chains.ts
// This is just so we can clearly see which of wagmi's first-class chains we provide metadata for
export type ChainName =
  | "futurenet"
  | "public"
  | "testnet"
  | "sandbox"
  | "standalone";

export type ChainMetadata = WalletChain;
