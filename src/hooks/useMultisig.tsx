import * as MultisigContract from "../lib/contract";
import { MULTISIGS, NETWORK_PASSPHRASE, RPC_URL } from "@/lib/constants";

export const useMultisig = async (multisigId: string) => {
  // Instantiate Msig class
  const multisigContract = new MultisigContract.Client({
    contractId: multisigId,
    rpcUrl: RPC_URL,
    networkPassphrase: NETWORK_PASSPHRASE,
  });

  // Query multisig Info
  const info = (await multisigContract.query_multisig_info()).result.unwrap();

  // Query multisig members
  const members = (await multisigContract.query_multisig_members()).result.unwrap();

  const proposals = (await multisigContract.query_all_proposals()).result.unwrap();

  return {
    info,
    members,
    proposals
  };
};
