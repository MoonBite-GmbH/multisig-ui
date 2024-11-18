import { Wallet } from "@/lib/wallets/types";
import * as MultisigContract from "./contract";

import { NETWORK_PASSPHRASE, RPC_URL } from "@/lib/constants";

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
    creation_date,
    expiration_date,
  }: {
    title: string;
    description: string;
    recipient: string;
    amount: number;
    token: string;
    creation_date: Date;
    expiration_date: Date | undefined;
  }
) => {
  // Create Client
  const client = new MultisigContract.Client({
    publicKey: userPublicKey,
    signTransaction: (tx: string) => wallet.signTransaction(tx),
    contractId: contractId,
    networkPassphrase: NETWORK_PASSPHRASE,
    rpcUrl: RPC_URL,
  });

  creation_date.setHours(0, 0, 0, 0);

  const tx = await client.create_transaction_proposal({
    sender: userPublicKey,
    title,
    description,
    recipient,
    amount: BigInt(amount * 10 ** 7),
    token,
    expiration_date: expiration_date
      ? BigInt((expiration_date.getTime() - creation_date.getTime()) / 1000)
      : undefined,
  });

  const res = await tx.signAndSend();
  return res.result.unwrap();
};

export const createUpdateProposal = async (
  wallet: Wallet,
  userPublicKey: string,
  contractId: string,
  {
    title,
    description,
    wasmHash,
    expiration_date,
    creation_date,
  }: {
    title: string;
    description: string;
    wasmHash: string;
    expiration_date: Date | undefined;
    creation_date: Date;
  }
) => {
  function hexToUint8Array(hex: string): Uint8Array {
    if (hex.length !== 64) {
      throw new Error(
        "Expected a 64-character hexadecimal string representing 32 bytes."
      );
    }

    const uint8Array = new Uint8Array(32); // 32 bytes for the Uint8Array
    for (let i = 0; i < 32; i++) {
      const hexChunk = hex.substring(i * 2, i * 2 + 2);
      uint8Array[i] = parseInt(hexChunk, 16);
    }

    return uint8Array;
  }

  // Create Client
  const client = new MultisigContract.Client({
    publicKey: userPublicKey,
    signTransaction: (tx: string) => wallet.signTransaction(tx),
    contractId: contractId,
    networkPassphrase: NETWORK_PASSPHRASE,
    rpcUrl: RPC_URL,
  });

  creation_date.setHours(0, 0, 0, 0);

  const tx = await client.create_update_proposal({
    sender: userPublicKey,
    title: title,
    description: description,
    new_wasm_hash: Buffer.from(hexToUint8Array(wasmHash)),
    expiration_date: expiration_date
      ? BigInt((expiration_date.getTime() - creation_date.getTime()) / 1000)
      : undefined,
  });

  const res = await tx.signAndSend();
  return res.result.unwrap();
};

export const getLatestProposalId = async (multisigId: string) => {
  const multisigContract = new MultisigContract.Client({
    contractId: multisigId,
    rpcUrl: RPC_URL,
    networkPassphrase: NETWORK_PASSPHRASE,
  });

  const latest = (
    await multisigContract.query_last_proposal_id()
  ).result.unwrap();

  return latest;
};

export const signProposal = async (
  wallet: Wallet,
  userPublicKey: string,
  contractId: string,
  proposalId: string
) => {
  // Create Client
  const client = new MultisigContract.Client({
    publicKey: userPublicKey,
    signTransaction: (tx: string) => wallet.signTransaction(tx),
    contractId: contractId,
    networkPassphrase: NETWORK_PASSPHRASE,
    rpcUrl: RPC_URL,
  });

  const tx = await client.sign_proposal({
    sender: userPublicKey,
    proposal_id: BigInt(proposalId),
  });

  const res = await tx.signAndSend();
  return res.result.unwrap();
};

export const executeProposal = async (
  wallet: Wallet,
  userPublicKey: string,
  contractId: string,
  proposalId: string
) => {
  // Create Client
  const client = new MultisigContract.Client({
    publicKey: userPublicKey,
    signTransaction: (tx: string) => wallet.signTransaction(tx),
    contractId: contractId,
    networkPassphrase: NETWORK_PASSPHRASE,
    rpcUrl: RPC_URL,
  });

  const tx = await client.execute_proposal({
    sender: userPublicKey,
    proposal_id: BigInt(proposalId),
  });

  const res = await tx.signAndSend();
  return res.result.unwrap();
};
