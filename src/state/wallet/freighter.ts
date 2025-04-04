import freighterApi from "@stellar/freighter-api";
import { NETWORK_PASSPHRASE } from "@/lib/constants";
import { Connector, NetworkDetails } from "../types";

export function freighter(): Connector {
  return {
    id: "freighter",
    name: "Freighter",
    iconUrl: "http://i.epvpimg.com/o9f6fab.png",
    iconBackground: "#fff",
    installed: true,
    downloadUrls: {
      browserExtension:
        "https://chrome.google.com/webstore/detail/freighter/bcacfldlkkdogcmkkibnjlakofdplcbk?hl=en",
    },
    async isConnected(): Promise<boolean> {
      return !!freighterApi?.isConnected();
    },
    async getNetworkDetails(): Promise<NetworkDetails> {
      // !TODO - find a better solution here
      return {
        ...(await freighterApi.getNetworkDetails()),
        networkUrl:
          "https://mainnet.stellar.validationcloud.io/v1/YcyPYotN_b6-_656rpr0CabDwlGgkT42NCzPVIqcZh0",
      };
    },
    async getPublicKey(): Promise<string> {
      await freighterApi.requestAccess();
      return (await freighterApi.getAddress()).address;
    },
    signTransaction(
      xdr: string,
      opts?: {
        network?: string;
        networkPassphrase?: string;
        accountToSign?: string;
      }
    ): Promise<{signedTxXdr: string; signerAddress?: string | undefined;}> {
      return freighterApi.signTransaction(xdr, {
        networkPassphrase: NETWORK_PASSPHRASE,
      });
    },
  };
}
