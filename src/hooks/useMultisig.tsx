import Signer from "@/lib/wallets/Signer";
import * as MultisigContract from "../lib/contract";
import { NETWORK_PASSPHRASE, RPC_URL } from "@/lib/constants";

export const useMultisig = async (multisigId: string, publicKey?: string) => {
  // Instantiate Msig class
  const multisigContract = new MultisigContract.Client({
    contractId: multisigId,
    rpcUrl: RPC_URL,
    networkPassphrase: NETWORK_PASSPHRASE,
    signTransaction: (tx) => new Signer().sign(tx),
    publicKey,
  });

  // Query multisig Info
  const infoN = await multisigContract.query_multisig_info({ simulate: false });
  const infoB = await infoN.simulate({ restore: true });

  const info = infoB.result.unwrap();

  // Query multisig members
  const members = (
    await multisigContract.query_multisig_members()
  ).result.unwrap();

  const proposalsN = await multisigContract.query_all_proposals({
    simulate: false,
  });
  const proposalsB = await proposalsN.simulate({ restore: true });
  const proposals = proposalsB.result.unwrap();

  return {
    info,
    members,
    proposals,
  };
};
