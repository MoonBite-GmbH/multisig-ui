import { Wallet } from "@/lib/wallets/types";
import * as DeployContract from "./deploy_contract";
import {
  DEPLOY_CONTRACT_ID,
  NETWORK_PASSPHRASE,
  RPC_URL,
} from "@/lib/constants";

export const deployMultisigContract = async (
  wallet: Wallet,
  userPublicKey: string,
  {
    name,
    description,
    threshold,
    members,
  }: {
    name: string;
    description: string;
    threshold: number;
    members: string[];
  },
) => {
  // Create Client
  const client = new DeployContract.Client({
    publicKey: userPublicKey,
    signTransaction: (tx: string) => wallet.signTransaction(tx),
    contractId: DEPLOY_CONTRACT_ID,
    networkPassphrase: NETWORK_PASSPHRASE,
    rpcUrl: RPC_URL,
  });

  // Deploy Contract
  try {
    const deployer = userPublicKey;
    // Generate a random 32 byte string
    const randomBytes = new Uint8Array(32);
    const random = crypto.getRandomValues(randomBytes);

    const salt = Buffer.from(random);
    const quorum_bps = threshold * 10000;

    const tx = await client.deploy_new_multisig({
      deployer,
      salt,
      name,
      description,
      members,
      quorum_bps,
    });
    const res = await tx.signAndSend();
    return res.result;
  } catch (error) {
    console.error(error);
  }
};
