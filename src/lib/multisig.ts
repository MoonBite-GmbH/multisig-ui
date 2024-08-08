import { Wallet } from "@/lib/wallets/types";
import * as MultisigContract from "./contract";

import {
  NETWORK_PASSPHRASE,
  RPC_URL,
} from "@/lib/constants";

export const createTransactionProposal = async (
  wallet: Wallet,
  userPublicKey: string,
  contractId: string,
  {
    title,
    description,
    recipient,
    amount,
    token,
  }: {
    title: string;
    description: string;
    recipient: string;
    amount: number;
    token: string;
  },
) => {
  // Create Client
  const client = new MultisigContract.Client({
    publicKey: userPublicKey,
    signTransaction: (tx: string) => wallet.signTransaction(tx),
    contractId: contractId,
    networkPassphrase: NETWORK_PASSPHRASE,
    rpcUrl: RPC_URL,
  });

  try {
    const tx = await client.create_transaction_proposal({
      sender: userPublicKey,
      title,
      description,
      recipient,
      amount: BigInt(amount),
      token,
    });

    const res = await tx.signAndSend();
    return res.result;
  } catch (error) {
    console.error(error);
  }
};
