import freighterApi from "@stellar/freighter-api";
import { xBullWalletConnect } from "@creit.tech/xbull-wallet-connect";
import { Connector, NetworkDetails } from "../types";

export function xbull(): Connector {
  return {
    id: "xbull",
    name: "xBull",
    iconUrl: "http://i.epvpimg.com/wYBJfab.png",
    iconBackground: "#fff",
    installed: true,
    downloadUrls: {
      browserExtension:
        "https://chrome.google.com/webstore/detail/freighter/bcacfldlkkdogcmkkibnjlakofdplcbk?hl=en",
    },
    async isConnected(): Promise<boolean> {
      const bridge: xBullWalletConnect = new xBullWalletConnect();
      return bridge.publicKey !== undefined;
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
      const bridge: xBullWalletConnect = new xBullWalletConnect();
      const publicKey: string = await bridge.connect();
      return publicKey;
    },
    async signTransaction(
      xdr: string,
      opts?: {
        network?: string;
        networkPassphrase?: string;
        accountToSign?: string;
      },
    ): Promise<{signedTxXdr: string; signerAddress?: string | undefined;}> {
      const bridge: xBullWalletConnect = new xBullWalletConnect();

      const signature = await bridge.sign({
        xdr,
        network: opts?.networkPassphrase,
        publicKey: opts?.accountToSign,
      });

      bridge.closeConnections();
      return {
        signedTxXdr: signature,
        signerAddress: opts?.accountToSign!,
      }
    },
  };
}
