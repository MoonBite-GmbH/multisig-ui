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
  const info = (await multisigContract.query_multisig_info()).result;

  // Query multisig members
  const members = (await multisigContract.query_multisig_members()).result;

  return {
    info,
    members,
  };
};

export const useUserMultisigs = async () => {
  // TODO: Fetch multisigs from the api, for now we will use this hardcoded list
  const addresses = MULTISIGS;

  const results = addresses.map(async (address) => {
    // Instantiate Msig class
    const multisigContract = new MultisigContract.Client({
      contractId: address,
      rpcUrl: RPC_URL,
      networkPassphrase: NETWORK_PASSPHRASE,
    });

    // Query multisig Info
    const info = (await multisigContract.query_multisig_info()).result;

    // Query multisig members
    const members = (await multisigContract.query_multisig_members()).result;

    return {
      info,
      members,
      address: address,
    };
  });

  return await Promise.all(results);
};
