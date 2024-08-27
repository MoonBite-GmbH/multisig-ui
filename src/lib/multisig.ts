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
    expiration_date,
  }: {
    title: string;
    description: string;
    recipient: string;
    amount: number;
    token: string;
    expiration_date: Date | undefined;
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
      expiration_date: expiration_date ? BigInt(expiration_date.getTime()) : undefined,
    });

    const res = await tx.signAndSend();
    return res.result.unwrap();
  } catch (error) {
    console.error(error);
  }
};

export const createUpdateProposal = async (
  wallet: Wallet,
  userPublicKey: string,
  contractId: string,
  {
    wasmHash,
    expiration_date
  }: {
    wasmHash: string;
    expiration_date: Date | undefined;
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
    const tx = await client.create_update_proposal({
      sender: userPublicKey,
      new_wasm_hash: Buffer.from(wasmHash),
      expiration_date: expiration_date ? BigInt(expiration_date.getTime()) : undefined,
    });

    const res = await tx.signAndSend();
    return res.result.unwrap();
  } catch (error) {
    console.error(error);
  }
};

export const signProposal = async (
  wallet: Wallet,
  userPublicKey: string,
  contractId: string,
  proposalId: string,
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
    const tx = await client.sign_proposal({
      sender: userPublicKey,
      proposal_id: BigInt(proposalId)
    });

    const res = await tx.signAndSend();
    return res.result.unwrap();
  } catch (error) {
    console.error(error);
  }
};

export const executeProposal = async (
  wallet: Wallet,
  userPublicKey: string,
  contractId: string,
  proposalId: string,
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
    const tx = await client.execute_proposal({
      sender: userPublicKey,
      proposal_id: BigInt(proposalId)
    });

    const res = await tx.signAndSend();
    return res.result.unwrap();
  } catch (error) {
    console.error(error);
  }
};
