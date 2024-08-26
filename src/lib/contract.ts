import { Buffer } from "buffer";
import {
  AssembledTransaction,
  Client as ContractClient,
  ClientOptions as ContractClientOptions,
  Spec as ContractSpec,
  Result,
} from "@stellar/stellar-sdk/contract";

export type u32 = number;
export type i32 = number;
export type u64 = bigint;
export type i64 = bigint;
export type u128 = bigint;
export type i128 = bigint;
export type u256 = bigint;
export type i256 = bigint;
export type Option<T> = T | undefined;
export type Typepoint = bigint;

export * from "@stellar/stellar-sdk";
export * as contract from "@stellar/stellar-sdk/contract";
export * as rpc from "@stellar/stellar-sdk/rpc";

if (typeof window !== "undefined") {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}

export const networks = {
  testnet: {
    networkPassphrase: "Test SDF Network ; September 2015",
    contractId: "CCLHNFFLGTVZYTB7KWLCPWDAUXRCDZBRV4XCJ6YBOMUIH4DDUOA5XOTJ",
  },
} as const;

export const Errors = {
  0: { message: "Unauthorized" },

  1: { message: "AlreadyInitialized" },

  2: { message: "InitializeTooLowQuorum" },

  3: { message: "InitializeTooHighQuorum" },

  4: { message: "UnauthorizedNotAMember" },

  5: { message: "TitleTooLong" },

  6: { message: "DescriptionTooLong" },

  7: { message: "ProposalClosed" },

  8: { message: "QuorumNotReached" },

  9: { message: "ProposalNotFound" },

  10: { message: "ProposalExpired" },

  11: { message: "InvalidExpirationDate" },
};

export interface Proposal {
  creation_timestamp: u64;
  expiration_timestamp: u64;
  id: u32;
  proposal: ProposalType;
  sender: string;
  status: ProposalStatus;
}

export type ProposalType =
  | { tag: "Transaction"; values: readonly [Transaction] }
  | { tag: "UpdateContract"; values: readonly [Buffer] };

export type ProposalStatus =
  | { tag: "Open"; values: void }
  | { tag: "Closed"; values: void };

export interface Transaction {
  amount: u64;
  description: string;
  recipient: string;
  title: string;
  token: string;
}

export interface MultisigInfo {
  description: string;
  members: Array<string>;
  name: string;
  quorum_bps: u32;
  version_proposal: u32;
}

export type DataKey =
  | { tag: "IsInitialized"; values: void }
  | { tag: "NameDescription"; values: void }
  | { tag: "QuorumBps"; values: void }
  | { tag: "Multisig"; values: void }
  | { tag: "LastProposalId"; values: void }
  | { tag: "Proposal"; values: readonly [u32] }
  | { tag: "ProposalSignatures"; values: readonly [u32] }
  | { tag: "Version"; values: void };

export interface Client {
  /**
   * Construct and simulate a initialize transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Initialize the contract
   * members is a vector of addresses that this multisig will consist of
   * quorum_bps requires to pass the minimum amount of required signers in BPS
   * if not present, default if 100%
   */
  initialize: (
    {
      name,
      description,
      members,
      quorum_bps,
    }: {
      name: string;
      description: string;
      members: Array<string>;
      quorum_bps: Option<u32>;
    },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number;

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number;

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean;
    }
  ) => Promise<AssembledTransaction<null>>;

  /**
   * Construct and simulate a create_transaction_proposal transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  create_transaction_proposal: (
    {
      sender,
      title,
      description,
      recipient,
      amount,
      token,
      expiration_date,
    }: {
      sender: string;
      title: string;
      description: string;
      recipient: string;
      amount: u64;
      token: string;
      expiration_date: Option<u64>;
    },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number;

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number;

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean;
    }
  ) => Promise<AssembledTransaction<null>>;

  /**
   * Construct and simulate a create_update_proposal transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  create_update_proposal: (
    {
      sender,
      new_wasm_hash,
      expiration_date,
    }: { sender: string; new_wasm_hash: Buffer; expiration_date: Option<u64> },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number;

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number;

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean;
    }
  ) => Promise<AssembledTransaction<null>>;

  /**
   * Construct and simulate a sign_proposal transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  sign_proposal: (
    { sender, proposal_id }: { sender: string; proposal_id: u32 },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number;

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number;

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean;
    }
  ) => Promise<AssembledTransaction<null>>;

  /**
   * Construct and simulate a execute_proposal transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  execute_proposal: (
    { sender, proposal_id }: { sender: string; proposal_id: u32 },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number;

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number;

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean;
    }
  ) => Promise<AssembledTransaction<null>>;

  /**
   * Construct and simulate a remove_proposal transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  remove_proposal: (
    { sender, proposal_id }: { sender: string; proposal_id: u32 },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number;

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number;

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean;
    }
  ) => Promise<AssembledTransaction<null>>;

  /**
   * Construct and simulate a query_multisig_info transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  query_multisig_info: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<MultisigInfo>>;

  /**
   * Construct and simulate a query_multisig_members transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  query_multisig_members: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Array<string>>>;

  /**
   * Construct and simulate a query_proposal transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  query_proposal: (
    { proposal_id }: { proposal_id: u32 },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number;

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number;

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean;
    }
  ) => Promise<AssembledTransaction<Option<Proposal>>>;

  /**
   * Construct and simulate a query_signatures transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  query_signatures: (
    { proposal_id }: { proposal_id: u32 },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number;

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number;

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean;
    }
  ) => Promise<AssembledTransaction<Array<readonly [string, boolean]>>>;

  /**
   * Construct and simulate a query_last_proposal_id transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  query_last_proposal_id: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<u32>>;

  /**
   * Construct and simulate a query_all_proposals transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  query_all_proposals: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Array<Proposal>>>;
}
export class Client extends ContractClient {
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([
        "AAAAAAAAAMVJbml0aWFsaXplIHRoZSBjb250cmFjdAptZW1iZXJzIGlzIGEgdmVjdG9yIG9mIGFkZHJlc3NlcyB0aGF0IHRoaXMgbXVsdGlzaWcgd2lsbCBjb25zaXN0IG9mCnF1b3J1bV9icHMgcmVxdWlyZXMgdG8gcGFzcyB0aGUgbWluaW11bSBhbW91bnQgb2YgcmVxdWlyZWQgc2lnbmVycyBpbiBCUFMKaWYgbm90IHByZXNlbnQsIGRlZmF1bHQgaWYgMTAwJQAAAAAAAAppbml0aWFsaXplAAAAAAAEAAAAAAAAAARuYW1lAAAAEAAAAAAAAAALZGVzY3JpcHRpb24AAAAAEAAAAAAAAAAHbWVtYmVycwAAAAPqAAAAEwAAAAAAAAAKcXVvcnVtX2JwcwAAAAAD6AAAAAQAAAAA",
        "AAAAAAAAAAAAAAAbY3JlYXRlX3RyYW5zYWN0aW9uX3Byb3Bvc2FsAAAAAAcAAAAAAAAABnNlbmRlcgAAAAAAEwAAAAAAAAAFdGl0bGUAAAAAAAAQAAAAAAAAAAtkZXNjcmlwdGlvbgAAAAAQAAAAAAAAAAlyZWNpcGllbnQAAAAAAAATAAAAAAAAAAZhbW91bnQAAAAAAAYAAAAAAAAABXRva2VuAAAAAAAAEwAAAAAAAAAPZXhwaXJhdGlvbl9kYXRlAAAAA+gAAAAGAAAAAA==",
        "AAAAAAAAAAAAAAAWY3JlYXRlX3VwZGF0ZV9wcm9wb3NhbAAAAAAAAwAAAAAAAAAGc2VuZGVyAAAAAAATAAAAAAAAAA1uZXdfd2FzbV9oYXNoAAAAAAAD7gAAACAAAAAAAAAAD2V4cGlyYXRpb25fZGF0ZQAAAAPoAAAABgAAAAA=",
        "AAAAAAAAAAAAAAANc2lnbl9wcm9wb3NhbAAAAAAAAAIAAAAAAAAABnNlbmRlcgAAAAAAEwAAAAAAAAALcHJvcG9zYWxfaWQAAAAABAAAAAA=",
        "AAAAAAAAAAAAAAAQZXhlY3V0ZV9wcm9wb3NhbAAAAAIAAAAAAAAABnNlbmRlcgAAAAAAEwAAAAAAAAALcHJvcG9zYWxfaWQAAAAABAAAAAA=",
        "AAAAAAAAAAAAAAAPcmVtb3ZlX3Byb3Bvc2FsAAAAAAIAAAAAAAAABnNlbmRlcgAAAAAAEwAAAAAAAAALcHJvcG9zYWxfaWQAAAAABAAAAAA=",
        "AAAAAAAAAAAAAAATcXVlcnlfbXVsdGlzaWdfaW5mbwAAAAAAAAAAAQAAB9AAAAAMTXVsdGlzaWdJbmZv",
        "AAAAAAAAAAAAAAAWcXVlcnlfbXVsdGlzaWdfbWVtYmVycwAAAAAAAAAAAAEAAAPqAAAAEw==",
        "AAAAAAAAAAAAAAAOcXVlcnlfcHJvcG9zYWwAAAAAAAEAAAAAAAAAC3Byb3Bvc2FsX2lkAAAAAAQAAAABAAAD6AAAB9AAAAAIUHJvcG9zYWw=",
        "AAAAAAAAAAAAAAAQcXVlcnlfc2lnbmF0dXJlcwAAAAEAAAAAAAAAC3Byb3Bvc2FsX2lkAAAAAAQAAAABAAAD6gAAA+0AAAACAAAAEwAAAAE=",
        "AAAAAAAAAAAAAAAWcXVlcnlfbGFzdF9wcm9wb3NhbF9pZAAAAAAAAAAAAAEAAAAE",
        "AAAAAAAAAAAAAAATcXVlcnlfYWxsX3Byb3Bvc2FscwAAAAAAAAAAAQAAA+oAAAfQAAAACFByb3Bvc2Fs",
        "AAAABAAAAAAAAAAAAAAADUNvbnRyYWN0RXJyb3IAAAAAAAAMAAAAAAAAAAxVbmF1dGhvcml6ZWQAAAAAAAAAAAAAABJBbHJlYWR5SW5pdGlhbGl6ZWQAAAAAAAEAAAAAAAAAFkluaXRpYWxpemVUb29Mb3dRdW9ydW0AAAAAAAIAAAAAAAAAF0luaXRpYWxpemVUb29IaWdoUXVvcnVtAAAAAAMAAAAAAAAAFlVuYXV0aG9yaXplZE5vdEFNZW1iZXIAAAAAAAQAAAAAAAAADFRpdGxlVG9vTG9uZwAAAAUAAAAAAAAAEkRlc2NyaXB0aW9uVG9vTG9uZwAAAAAABgAAAAAAAAAOUHJvcG9zYWxDbG9zZWQAAAAAAAcAAAAAAAAAEFF1b3J1bU5vdFJlYWNoZWQAAAAIAAAAAAAAABBQcm9wb3NhbE5vdEZvdW5kAAAACQAAAAAAAAAPUHJvcG9zYWxFeHBpcmVkAAAAAAoAAAAAAAAAFUludmFsaWRFeHBpcmF0aW9uRGF0ZQAAAAAAAAs=",
        "AAAAAQAAAAAAAAAAAAAACFByb3Bvc2FsAAAABgAAAAAAAAASY3JlYXRpb25fdGltZXN0YW1wAAAAAAAGAAAAAAAAABRleHBpcmF0aW9uX3RpbWVzdGFtcAAAAAYAAAAAAAAAAmlkAAAAAAAEAAAAAAAAAAhwcm9wb3NhbAAAB9AAAAAMUHJvcG9zYWxUeXBlAAAAAAAAAAZzZW5kZXIAAAAAABMAAAAAAAAABnN0YXR1cwAAAAAH0AAAAA5Qcm9wb3NhbFN0YXR1cwAA",
        "AAAAAgAAAAAAAAAAAAAADFByb3Bvc2FsVHlwZQAAAAIAAAABAAAAAAAAAAtUcmFuc2FjdGlvbgAAAAABAAAH0AAAAAtUcmFuc2FjdGlvbgAAAAABAAAAAAAAAA5VcGRhdGVDb250cmFjdAAAAAAAAQAAA+4AAAAg",
        "AAAAAgAAAAAAAAAAAAAADlByb3Bvc2FsU3RhdHVzAAAAAAACAAAAAAAAAAAAAAAET3BlbgAAAAAAAAAAAAAABkNsb3NlZAAA",
        "AAAAAQAAAAAAAAAAAAAAC1RyYW5zYWN0aW9uAAAAAAUAAAAAAAAABmFtb3VudAAAAAAABgAAAAAAAAALZGVzY3JpcHRpb24AAAAAEAAAAAAAAAAJcmVjaXBpZW50AAAAAAAAEwAAAAAAAAAFdGl0bGUAAAAAAAAQAAAAAAAAAAV0b2tlbgAAAAAAABM=",
        "AAAAAQAAAAAAAAAAAAAADE11bHRpc2lnSW5mbwAAAAUAAAAAAAAAC2Rlc2NyaXB0aW9uAAAAABAAAAAAAAAAB21lbWJlcnMAAAAD6gAAABMAAAAAAAAABG5hbWUAAAAQAAAAAAAAAApxdW9ydW1fYnBzAAAAAAAEAAAAAAAAABB2ZXJzaW9uX3Byb3Bvc2FsAAAABA==",
        "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAACAAAAAAAAAAAAAAADUlzSW5pdGlhbGl6ZWQAAAAAAAAAAAAAAAAAAA9OYW1lRGVzY3JpcHRpb24AAAAAAAAAAAAAAAAJUXVvcnVtQnBzAAAAAAAAAAAAAAAAAAAITXVsdGlzaWcAAAAAAAAAAAAAAA5MYXN0UHJvcG9zYWxJZAAAAAAAAQAAAAAAAAAIUHJvcG9zYWwAAAABAAAABAAAAAEAAAAAAAAAElByb3Bvc2FsU2lnbmF0dXJlcwAAAAAAAQAAAAQAAAAAAAAAAAAAAAdWZXJzaW9uAA==",
      ]),
      options
    );
  }
  public readonly fromJSON = {
    initialize: this.txFromJSON<null>,
    create_transaction_proposal: this.txFromJSON<null>,
    create_update_proposal: this.txFromJSON<null>,
    sign_proposal: this.txFromJSON<null>,
    execute_proposal: this.txFromJSON<null>,
    remove_proposal: this.txFromJSON<null>,
    query_multisig_info: this.txFromJSON<MultisigInfo>,
    query_multisig_members: this.txFromJSON<Array<string>>,
    query_proposal: this.txFromJSON<Option<Proposal>>,
    query_signatures: this.txFromJSON<Array<readonly [string, boolean]>>,
    query_last_proposal_id: this.txFromJSON<u32>,
    query_all_proposals: this.txFromJSON<Array<Proposal>>,
  };
}
