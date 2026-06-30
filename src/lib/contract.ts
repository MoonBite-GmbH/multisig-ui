import { Buffer } from "buffer";
import { Address } from "@stellar/stellar-sdk";
import {
  AssembledTransaction,
  Client as ContractClient,
  ClientOptions as ContractClientOptions,
  MethodOptions,
  Result,
  Spec as ContractSpec,
} from "@stellar/stellar-sdk/contract";
import type {
  u32,
  i32,
  u64,
  i64,
  u128,
  i128,
  u256,
  i256,
  Option,
  Timepoint,
  Duration,
} from "@stellar/stellar-sdk/contract";
export * from "@stellar/stellar-sdk";
export * as contract from "@stellar/stellar-sdk/contract";
export * as rpc from "@stellar/stellar-sdk/rpc";

if (typeof window !== "undefined") {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}




export const ContractError = {
  0: {message:"Unauthorized"},
  1: {message:"AlreadyInitialized"},
  2: {message:"InitializeTooLowQuorum"},
  3: {message:"InitializeTooHighQuorum"},
  4: {message:"UnauthorizedNotAMember"},
  5: {message:"TitleTooLong"},
  6: {message:"DescriptionTooLong"},
  7: {message:"ProposalClosed"},
  8: {message:"QuorumNotReached"},
  9: {message:"ProposalNotFound"},
  10: {message:"ProposalExpired"},
  11: {message:"InvalidExpirationDate"},
  12: {message:"MembersListEmpty"},
  13: {message:"ZeroAddressProvided"}
}

export type DataKey = {tag: "IsInitialized", values: void} | {tag: "NameDescription", values: void} | {tag: "QuorumBps", values: void} | {tag: "Multisig", values: void} | {tag: "LastProposalId", values: void} | {tag: "Proposal", values: readonly [u64]} | {tag: "ProposalSignatures", values: readonly [u64]} | {tag: "Version", values: void};


export interface Proposal {
  creation_timestamp: u64;
  description: string;
  expiration_timestamp: u64;
  id: u64;
  proposal: ProposalType;
  sender: string;
  status: ProposalStatus;
  title: string;
}


export interface Transaction {
  amount: u64;
  recipient: string;
  token: string;
}


export interface MultisigInfo {
  description: string;
  members: Array<string>;
  name: string;
  quorum_bps: u32;
  version_proposal: u32;
}

export type ProposalType = {tag: "Transaction", values: readonly [Transaction]} | {tag: "UpdateContract", values: readonly [Buffer]} | {tag: "UpdateMembers", values: readonly [Array<string>]};

export type ProposalStatus = {tag: "Open", values: void} | {tag: "Closed", values: void};

export interface Client {
  /**
   * Construct and simulate a initialize transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Initialize the contract
   * members is a vector of addresses that this multisig will consist of
   * quorum_bps requires to pass the minimum amount of required signers in BPS
   * if not present, default if 100%
   */
  initialize: ({name, description, members, quorum_bps}: {name: string, description: string, members: Array<string>, quorum_bps: Option<u32>}, options?: MethodOptions) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a sign_proposal transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  sign_proposal: ({sender, proposal_id}: {sender: string, proposal_id: u64}, options?: MethodOptions) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a query_proposal transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  query_proposal: ({proposal_id}: {proposal_id: u64}, options?: MethodOptions) => Promise<AssembledTransaction<Result<Proposal>>>

  /**
   * Construct and simulate a execute_proposal transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  execute_proposal: ({sender, proposal_id}: {sender: string, proposal_id: u64}, options?: MethodOptions) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a query_signatures transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  query_signatures: ({proposal_id}: {proposal_id: u64}, options?: MethodOptions) => Promise<AssembledTransaction<Result<Array<readonly [string, boolean]>>>>

  /**
   * Construct and simulate a is_proposal_ready transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  is_proposal_ready: ({proposal_id}: {proposal_id: u64}, options?: MethodOptions) => Promise<AssembledTransaction<Result<boolean>>>

  /**
   * Construct and simulate a query_all_proposals transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  query_all_proposals: (options?: MethodOptions) => Promise<AssembledTransaction<Result<Array<Proposal>>>>

  /**
   * Construct and simulate a query_multisig_info transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  query_multisig_info: (options?: MethodOptions) => Promise<AssembledTransaction<Result<MultisigInfo>>>

  /**
   * Construct and simulate a create_update_proposal transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  create_update_proposal: ({sender, title, description, new_wasm_hash, expiration_date}: {sender: string, title: string, description: string, new_wasm_hash: Buffer, expiration_date: Option<u64>}, options?: MethodOptions) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a query_last_proposal_id transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  query_last_proposal_id: (options?: MethodOptions) => Promise<AssembledTransaction<Result<u64>>>

  /**
   * Construct and simulate a query_multisig_members transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  query_multisig_members: (options?: MethodOptions) => Promise<AssembledTransaction<Result<Array<string>>>>

  /**
   * Construct and simulate a create_transaction_proposal transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  create_transaction_proposal: ({sender, title, description, recipient, amount, token, expiration_date}: {sender: string, title: string, description: string, recipient: string, amount: u64, token: string, expiration_date: Option<u64>}, options?: MethodOptions) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a create_member_update_proposal transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Propose to replace the entire multisig membership with `new_members`.
   * Once executed (after reaching quorum), the multisig members list is
   * overwritten with the provided list. The signers required to pass this
   * proposal are the *current* members at execution time.
   */
  create_member_update_proposal: ({sender, title, description, new_members, expiration_date}: {sender: string, title: string, description: string, new_members: Array<string>, expiration_date: Option<u64>}, options?: MethodOptions) => Promise<AssembledTransaction<Result<void>>>

}
export class Client extends ContractClient {
  static async deploy<T = Client>(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options: MethodOptions &
      Omit<ContractClientOptions, "contractId"> & {
        /** The hash of the Wasm blob, which must already be installed on-chain. */
        wasmHash: Buffer | string;
        /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
        salt?: Buffer | Uint8Array;
        /** The format used to decode `wasmHash`, if it's provided as a string. */
        format?: "hex" | "base64";
      }
  ): Promise<AssembledTransaction<T>> {
    return ContractClient.deploy(null, options)
  }
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([ "AAAABAAAAAAAAAAAAAAADUNvbnRyYWN0RXJyb3IAAAAAAAAOAAAAAAAAAAxVbmF1dGhvcml6ZWQAAAAAAAAAAAAAABJBbHJlYWR5SW5pdGlhbGl6ZWQAAAAAAAEAAAAAAAAAFkluaXRpYWxpemVUb29Mb3dRdW9ydW0AAAAAAAIAAAAAAAAAF0luaXRpYWxpemVUb29IaWdoUXVvcnVtAAAAAAMAAAAAAAAAFlVuYXV0aG9yaXplZE5vdEFNZW1iZXIAAAAAAAQAAAAAAAAADFRpdGxlVG9vTG9uZwAAAAUAAAAAAAAAEkRlc2NyaXB0aW9uVG9vTG9uZwAAAAAABgAAAAAAAAAOUHJvcG9zYWxDbG9zZWQAAAAAAAcAAAAAAAAAEFF1b3J1bU5vdFJlYWNoZWQAAAAIAAAAAAAAABBQcm9wb3NhbE5vdEZvdW5kAAAACQAAAAAAAAAPUHJvcG9zYWxFeHBpcmVkAAAAAAoAAAAAAAAAFUludmFsaWRFeHBpcmF0aW9uRGF0ZQAAAAAAAAsAAAAAAAAAEE1lbWJlcnNMaXN0RW1wdHkAAAAMAAAAAAAAABNaZXJvQWRkcmVzc1Byb3ZpZGVkAAAAAA0=",
        "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAACAAAAAAAAAAAAAAADUlzSW5pdGlhbGl6ZWQAAAAAAAAAAAAAAAAAAA9OYW1lRGVzY3JpcHRpb24AAAAAAAAAAAAAAAAJUXVvcnVtQnBzAAAAAAAAAAAAAAAAAAAITXVsdGlzaWcAAAAAAAAAAAAAAA5MYXN0UHJvcG9zYWxJZAAAAAAAAQAAAAAAAAAIUHJvcG9zYWwAAAABAAAABgAAAAEAAAAAAAAAElByb3Bvc2FsU2lnbmF0dXJlcwAAAAAAAQAAAAYAAAAAAAAAAAAAAAdWZXJzaW9uAA==",
        "AAAAAQAAAAAAAAAAAAAACFByb3Bvc2FsAAAACAAAAAAAAAASY3JlYXRpb25fdGltZXN0YW1wAAAAAAAGAAAAAAAAAAtkZXNjcmlwdGlvbgAAAAAQAAAAAAAAABRleHBpcmF0aW9uX3RpbWVzdGFtcAAAAAYAAAAAAAAAAmlkAAAAAAAGAAAAAAAAAAhwcm9wb3NhbAAAB9AAAAAMUHJvcG9zYWxUeXBlAAAAAAAAAAZzZW5kZXIAAAAAABMAAAAAAAAABnN0YXR1cwAAAAAH0AAAAA5Qcm9wb3NhbFN0YXR1cwAAAAAAAAAAAAV0aXRsZQAAAAAAABA=",
        "AAAAAQAAAAAAAAAAAAAAC1RyYW5zYWN0aW9uAAAAAAMAAAAAAAAABmFtb3VudAAAAAAABgAAAAAAAAAJcmVjaXBpZW50AAAAAAAAEwAAAAAAAAAFdG9rZW4AAAAAAAAT",
        "AAAAAQAAAAAAAAAAAAAADE11bHRpc2lnSW5mbwAAAAUAAAAAAAAAC2Rlc2NyaXB0aW9uAAAAABAAAAAAAAAAB21lbWJlcnMAAAAD6gAAABMAAAAAAAAABG5hbWUAAAAQAAAAAAAAAApxdW9ydW1fYnBzAAAAAAAEAAAAAAAAABB2ZXJzaW9uX3Byb3Bvc2FsAAAABA==",
        "AAAAAgAAAAAAAAAAAAAADFByb3Bvc2FsVHlwZQAAAAMAAAABAAAAAAAAAAtUcmFuc2FjdGlvbgAAAAABAAAH0AAAAAtUcmFuc2FjdGlvbgAAAAABAAAAAAAAAA5VcGRhdGVDb250cmFjdAAAAAAAAQAAA+4AAAAgAAAAAQAAAAAAAAANVXBkYXRlTWVtYmVycwAAAAAAAAEAAAPqAAAAEw==",
        "AAAAAgAAAAAAAAAAAAAADlByb3Bvc2FsU3RhdHVzAAAAAAACAAAAAAAAAAAAAAAET3BlbgAAAAAAAAAAAAAABkNsb3NlZAAA",
        "AAAAAAAAAMVJbml0aWFsaXplIHRoZSBjb250cmFjdAptZW1iZXJzIGlzIGEgdmVjdG9yIG9mIGFkZHJlc3NlcyB0aGF0IHRoaXMgbXVsdGlzaWcgd2lsbCBjb25zaXN0IG9mCnF1b3J1bV9icHMgcmVxdWlyZXMgdG8gcGFzcyB0aGUgbWluaW11bSBhbW91bnQgb2YgcmVxdWlyZWQgc2lnbmVycyBpbiBCUFMKaWYgbm90IHByZXNlbnQsIGRlZmF1bHQgaWYgMTAwJQAAAAAAAAppbml0aWFsaXplAAAAAAAEAAAAAAAAAARuYW1lAAAAEAAAAAAAAAALZGVzY3JpcHRpb24AAAAAEAAAAAAAAAAHbWVtYmVycwAAAAPqAAAAEwAAAAAAAAAKcXVvcnVtX2JwcwAAAAAD6AAAAAQAAAABAAAD6QAAAAIAAAfQAAAADUNvbnRyYWN0RXJyb3IAAAA=",
        "AAAAAAAAAAAAAAANc2lnbl9wcm9wb3NhbAAAAAAAAAIAAAAAAAAABnNlbmRlcgAAAAAAEwAAAAAAAAALcHJvcG9zYWxfaWQAAAAABgAAAAEAAAPpAAAAAgAAB9AAAAANQ29udHJhY3RFcnJvcgAAAA==",
        "AAAAAAAAAAAAAAAOcXVlcnlfcHJvcG9zYWwAAAAAAAEAAAAAAAAAC3Byb3Bvc2FsX2lkAAAAAAYAAAABAAAD6QAAB9AAAAAIUHJvcG9zYWwAAAfQAAAADUNvbnRyYWN0RXJyb3IAAAA=",
        "AAAAAAAAAAAAAAAQZXhlY3V0ZV9wcm9wb3NhbAAAAAIAAAAAAAAABnNlbmRlcgAAAAAAEwAAAAAAAAALcHJvcG9zYWxfaWQAAAAABgAAAAEAAAPpAAAAAgAAB9AAAAANQ29udHJhY3RFcnJvcgAAAA==",
        "AAAAAAAAAAAAAAAQcXVlcnlfc2lnbmF0dXJlcwAAAAEAAAAAAAAAC3Byb3Bvc2FsX2lkAAAAAAYAAAABAAAD6QAAA+oAAAPtAAAAAgAAABMAAAABAAAH0AAAAA1Db250cmFjdEVycm9yAAAA",
        "AAAAAAAAAAAAAAARaXNfcHJvcG9zYWxfcmVhZHkAAAAAAAABAAAAAAAAAAtwcm9wb3NhbF9pZAAAAAAGAAAAAQAAA+kAAAABAAAH0AAAAA1Db250cmFjdEVycm9yAAAA",
        "AAAAAAAAAAAAAAATcXVlcnlfYWxsX3Byb3Bvc2FscwAAAAAAAAAAAQAAA+kAAAPqAAAH0AAAAAhQcm9wb3NhbAAAB9AAAAANQ29udHJhY3RFcnJvcgAAAA==",
        "AAAAAAAAAAAAAAATcXVlcnlfbXVsdGlzaWdfaW5mbwAAAAAAAAAAAQAAA+kAAAfQAAAADE11bHRpc2lnSW5mbwAAB9AAAAANQ29udHJhY3RFcnJvcgAAAA==",
        "AAAAAAAAAAAAAAAWY3JlYXRlX3VwZGF0ZV9wcm9wb3NhbAAAAAAABQAAAAAAAAAGc2VuZGVyAAAAAAATAAAAAAAAAAV0aXRsZQAAAAAAABAAAAAAAAAAC2Rlc2NyaXB0aW9uAAAAABAAAAAAAAAADW5ld193YXNtX2hhc2gAAAAAAAPuAAAAIAAAAAAAAAAPZXhwaXJhdGlvbl9kYXRlAAAAA+gAAAAGAAAAAQAAA+kAAAACAAAH0AAAAA1Db250cmFjdEVycm9yAAAA",
        "AAAAAAAAAAAAAAAWcXVlcnlfbGFzdF9wcm9wb3NhbF9pZAAAAAAAAAAAAAEAAAPpAAAABgAAB9AAAAANQ29udHJhY3RFcnJvcgAAAA==",
        "AAAAAAAAAAAAAAAWcXVlcnlfbXVsdGlzaWdfbWVtYmVycwAAAAAAAAAAAAEAAAPpAAAD6gAAABMAAAfQAAAADUNvbnRyYWN0RXJyb3IAAAA=",
        "AAAAAAAAAAAAAAAbY3JlYXRlX3RyYW5zYWN0aW9uX3Byb3Bvc2FsAAAAAAcAAAAAAAAABnNlbmRlcgAAAAAAEwAAAAAAAAAFdGl0bGUAAAAAAAAQAAAAAAAAAAtkZXNjcmlwdGlvbgAAAAAQAAAAAAAAAAlyZWNpcGllbnQAAAAAAAATAAAAAAAAAAZhbW91bnQAAAAAAAYAAAAAAAAABXRva2VuAAAAAAAAEwAAAAAAAAAPZXhwaXJhdGlvbl9kYXRlAAAAA+gAAAAGAAAAAQAAA+kAAAACAAAH0AAAAA1Db250cmFjdEVycm9yAAAA",
        "AAAAAAAAAQVQcm9wb3NlIHRvIHJlcGxhY2UgdGhlIGVudGlyZSBtdWx0aXNpZyBtZW1iZXJzaGlwIHdpdGggYG5ld19tZW1iZXJzYC4KT25jZSBleGVjdXRlZCAoYWZ0ZXIgcmVhY2hpbmcgcXVvcnVtKSwgdGhlIG11bHRpc2lnIG1lbWJlcnMgbGlzdCBpcwpvdmVyd3JpdHRlbiB3aXRoIHRoZSBwcm92aWRlZCBsaXN0LiBUaGUgc2lnbmVycyByZXF1aXJlZCB0byBwYXNzIHRoaXMKcHJvcG9zYWwgYXJlIHRoZSAqY3VycmVudCogbWVtYmVycyBhdCBleGVjdXRpb24gdGltZS4AAAAAAAAdY3JlYXRlX21lbWJlcl91cGRhdGVfcHJvcG9zYWwAAAAAAAAFAAAAAAAAAAZzZW5kZXIAAAAAABMAAAAAAAAABXRpdGxlAAAAAAAAEAAAAAAAAAALZGVzY3JpcHRpb24AAAAAEAAAAAAAAAALbmV3X21lbWJlcnMAAAAD6gAAABMAAAAAAAAAD2V4cGlyYXRpb25fZGF0ZQAAAAPoAAAABgAAAAEAAAPpAAAAAgAAB9AAAAANQ29udHJhY3RFcnJvcgAAAA==" ]),
      options
    )
  }
  public readonly fromJSON = {
    initialize: this.txFromJSON<Result<void>>,
        sign_proposal: this.txFromJSON<Result<void>>,
        query_proposal: this.txFromJSON<Result<Proposal>>,
        execute_proposal: this.txFromJSON<Result<void>>,
        query_signatures: this.txFromJSON<Result<Array<readonly [string, boolean]>>>,
        is_proposal_ready: this.txFromJSON<Result<boolean>>,
        query_all_proposals: this.txFromJSON<Result<Array<Proposal>>>,
        query_multisig_info: this.txFromJSON<Result<MultisigInfo>>,
        create_update_proposal: this.txFromJSON<Result<void>>,
        query_last_proposal_id: this.txFromJSON<Result<u64>>,
        query_multisig_members: this.txFromJSON<Result<Array<string>>>,
        create_transaction_proposal: this.txFromJSON<Result<void>>,
        create_member_update_proposal: this.txFromJSON<Result<void>>
  }
}