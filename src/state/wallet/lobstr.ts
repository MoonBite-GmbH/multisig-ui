import {
  getPublicKey,
  isConnected,
  signTransaction,
} from "@lobstrco/signer-extension-api";
import { Connector, NetworkDetails } from "../types";

export function lobstr(): Connector {
  return {
    id: "lobstr",
    name: "Lobstr",
    iconUrl:
      "https://raw.githubusercontent.com/Lobstrco/lobstr-browser-extension/main/extension/public/static/images/icon128.png",
    iconBackground: "#fff",
    installed: true,
    downloadUrls: {
      browserExtension:
        "https://chrome.google.com/webstore/detail/freighter/bcacfldlkkdogcmkkibnjlakofdplcbk?hl=en",
    },
    async isConnected(): Promise<boolean> {
      return isConnected();
    },
    async getNetworkDetails(): Promise<NetworkDetails> {
      // TODO
      return {
        network: "testnet",
        networkUrl: "https://horizon-testnet.stellar.org",
        networkPassphrase: "Test SDF Network ; September 2015",
      };
    },
    getPublicKey(): Promise<string> {
      const pubKey: Promise<string> = getAddressFromLocalStorageByKey(
        "app-storage",
      )
        ? new Promise((resolve, reject) => {
            const pub: string =
              getAddressFromLocalStorageByKey("app-storage") || "";
            return pub;
          })
        : getPublicKey();

      return pubKey;
    },
    async signTransaction(
      xdr: string,
      opts?: {
        network?: string;
        networkPassphrase?: string;
        accountToSign?: string;
      },
    ): Promise<{signedTxXdr: string; signerAddress?: string | undefined;}> {
      return {
        signedTxXdr: await signTransaction(xdr),
        signerAddress: opts?.accountToSign,
      }
    },
  };
}

function getAddressFromLocalStorageByKey(key: string): string | undefined {
  const localStorageData = JSON.parse(localStorage.getItem(key) || "{}");
  if (
    localStorageData &&
    localStorageData.state &&
    localStorageData.state.wallet &&
    localStorageData.state.wallet.address
  ) {
    return localStorageData.state.wallet.address;
  } else {
    return undefined;
  }
}
