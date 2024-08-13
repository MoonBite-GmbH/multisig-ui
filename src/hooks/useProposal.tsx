import * as MultisigContract from "../lib/contract";
import { MULTISIGS, NETWORK_PASSPHRASE, RPC_URL } from "@/lib/constants";

export const useProposal = async (multisigId: string, proposalId: string) => {
  // Instantiate Msig class
  const multisigContract = new MultisigContract.Client({
    contractId: multisigId,
    rpcUrl: RPC_URL,
    networkPassphrase: NETWORK_PASSPHRASE,
  });

  // Query proposal Info
  const info = (await multisigContract.query_proposal({
    proposal_id: BigInt(proposalId)
  })).result.unwrap();

  return {
    info,
  };
};