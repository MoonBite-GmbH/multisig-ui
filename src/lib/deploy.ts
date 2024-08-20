import { Wallet } from "@/lib/wallets/types";
import * as DeployContract from "./deploy_contract";
import * as MultisigContract from "../lib/contract";
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

export const getUserMultisigs = async (walletAddress: string) => {
  const response = await fetch(`/api/${walletAddress}`, {
    method: 'GET',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  const multisigs = await response.json();

  const results = multisigs.map(async (entry: any) => {
    const address = entry.id;

    // Instantiate Msig class
    const multisigContract = new MultisigContract.Client({
      contractId: address,
      rpcUrl: RPC_URL,
      networkPassphrase: NETWORK_PASSPHRASE,
    });

    // Query multisig Info
    const info = (await multisigContract.query_multisig_info()).result.unwrap();

    // Query multisig members
    const members = (await multisigContract.query_multisig_members()).result.unwrap();

    const _proposals = (await multisigContract.query_all_proposals()).result.unwrap();

    const proposals: any[] = [];

    for(const proposal of _proposals) {
      const signatures = (await multisigContract.query_signatures({
        proposal_id: proposal.id
      })).result.unwrap()

      proposals.push({...proposal, signatures});
    }

    return {
      info,
      members,
      proposals,
      address: address,
    };
  });

  return await Promise.all(results);
}

export const setUserMultisig = async (multisigId: string, members: string[]) => {
  const response = await fetch('/api/multisig/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ multisigId, members }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return await response.json();
}
