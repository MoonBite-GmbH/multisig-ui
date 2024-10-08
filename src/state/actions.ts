import { Horizon } from "@stellar/stellar-sdk";
import { freighter } from "./wallet/freighter";
import { AppStorePersist } from "@/state/types";
import { allChains, networkToActiveChain } from "./wallet/chains";
import { usePersistStore } from "./store";
import { xbull } from "./wallet/xbull";
import { lobstr } from "./wallet/lobstr";
import { NETWORK_PASSPHRASE, RPC_URL } from "@/lib/constants";

export const createConnectWalletActions = () => {
  return {
    wallet: {
      address: undefined,
      activeChain: undefined,
      server: undefined,
      walletType: undefined,
    },

    // This function is called when the user clicks the "Connect" button
    // in the wallet modal. It uses the Freighters SDK to get the user's
    // address and network details, and then stores them in the app state.
    connectWallet: async (wallet: string) => {
      // Get the network details from the user's wallet.
      // TODO: Make this dynamic
      const networkDetails = {
        network: "public",
        networkPassphrase: NETWORK_PASSPHRASE,
        networkUrl: RPC_URL,
        sorobanRpcUrl: RPC_URL,
      };

      // Throw an error if the network is not supported.
      if (
        !allChains.find(
          (c: any) => c.networkPassphrase === networkDetails?.networkPassphrase
        )
      ) {
        const error = new Error(
          "Your Wallet network is not supported in this app"
        );
        throw error;
      }

      // Get the active chain from the network details.
      const activeChain = networkToActiveChain(networkDetails, allChains);

      // Get the user's address from the wallet.
      let address = "";

      switch (wallet) {
        case "freighter":
          address = await freighter().getPublicKey();
          break;
        case "xbull":
          address = await xbull().getPublicKey();
          break;
        case "lobstr":
          address = await lobstr().getPublicKey();
          break;
        default:
          throw new Error("Wallet not supported");
      }

      // Create a server object to connect to the blockchain.
      let server =
        networkDetails &&
        new Horizon.Server(networkDetails.networkUrl, {
          allowHttp: networkDetails.networkUrl.startsWith("http://"),
        });

      // Update the state to store the wallet address and server.
      // @ts-ignore
      usePersistStore.setState((state: AppStorePersist) => ({
        ...state,
        wallet: { address, activeChain, server, walletType: wallet },
      }));

      return;
    },

    // Disconnect the wallet
    disconnectWallet: () => {
      // Update the state
      usePersistStore.setState((state: AppStorePersist) => ({
        ...state,
        wallet: {
          address: undefined,
          activeChain: undefined,
          server: undefined,
          walletType: undefined,
        },
      }));
    },
  };
};
