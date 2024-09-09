import { create } from "zustand";
import { createConnectWalletActions } from "./actions";
import { persist } from "zustand/middleware";
import { Horizon } from "@stellar/stellar-sdk";
import { AppStorePersist } from "./types";
import { NETWORK_PASSPHRASE, RPC_URL } from "@/lib/constants";

export const usePersistStore = create<AppStorePersist>()(
  persist(
    (set, get) => {
      // Create a new server instance.
      const server = new Horizon.Server(RPC_URL);

      // The network passphrase for the test network.
      const networkPassphrase = NETWORK_PASSPHRASE;

      // Create a wallet with the given server and network passphrase.
      const walletPersist = createConnectWalletActions();

      return {
        server,
        networkPassphrase,
        ...walletPersist,
      };
    },
    {
      name: "wallet", // name of the item in the storage (must be unique)
    },
  ),
);
