import { create } from "zustand";
import { createConnectWalletActions } from "./actions";
import { persist } from "zustand/middleware";
import { Horizon } from "@stellar/stellar-sdk";
import { AppStorePersist } from "./types";

export const usePersistStore = create<AppStorePersist>()(
  persist(
    (set, get) => {
      // Create a new server instance.
      const server = new Horizon.Server("https://horizon-testnet.stellar.org");

      // The network passphrase for the test network.
      const networkPassphrase = "Test SDF Network ; September 2015";

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
