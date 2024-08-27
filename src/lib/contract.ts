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
    contractId: "0",
  },
} as const;

export const Errors = {
  0: { message: "" },
  1: { message: "" },
  2: { message: "" },
  3: { message: "" },
  4: { message: "" },
  5: { message: "" },
  6: { message: "" },
  7: { message: "" },
  8: { message: "" },
  9: { message: "" },
  10: { message: "" },
  11: { message: "" },
  12: { message: "" },
  13: { message: "" },
};

export interface Proposal {
  creation_timestamp: u64;
  expiration_timestamp: u64;
  id: u64;
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
  | { tag: "Proposal"; values: readonly [u64] }
  | { tag: "ProposalSignatures"; values: readonly [u64] }
  | { tag: "Version"; values: void };

export interface Client {
  /**
   * Construct and simulate a initialize transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.   *
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
  ) => Promise<AssembledTransaction<Result<void>>>;

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
  ) => Promise<AssembledTransaction<Result<void>>>;

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
  ) => Promise<AssembledTransaction<Result<void>>>;

  /**
   * Construct and simulate a sign_proposal transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  sign_proposal: (
    { sender, proposal_id }: { sender: string; proposal_id: u64 },
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
  ) => Promise<AssembledTransaction<Result<void>>>;

  /**
   * Construct and simulate a execute_proposal transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  execute_proposal: (
    { sender, proposal_id }: { sender: string; proposal_id: u64 },
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
  ) => Promise<AssembledTransaction<Result<void>>>;

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
  }) => Promise<AssembledTransaction<Result<MultisigInfo>>>;

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
  }) => Promise<AssembledTransaction<Result<Array<string>>>>;

  /**
   * Construct and simulate a query_proposal transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  query_proposal: (
    { proposal_id }: { proposal_id: u64 },
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
  ) => Promise<AssembledTransaction<Result<Proposal>>>;

  /**
   * Construct and simulate a query_signatures transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  query_signatures: (
    { proposal_id }: { proposal_id: u64 },
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
  ) => Promise<AssembledTransaction<Result<Array<readonly [string, boolean]>>>>;

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
  }) => Promise<AssembledTransaction<Result<u64>>>;

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
  }) => Promise<AssembledTransaction<Result<Array<Proposal>>>>;

  /**
   * Construct and simulate a is_proposal_ready transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  is_proposal_ready: (
    { proposal_id }: { proposal_id: u64 },
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
  ) => Promise<AssembledTransaction<Result<boolean>>>;
}
export class Client extends ContractClient {
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([
        "AAAAAAAAAMVJbml0aWFsaXplIHRoZSBjb250cmFjdAptZW1iZXJzIGlzIGEgdmVjdG9yIG9mIGFkZHJlc3NlcyB0aGF0IHRoaXMgbXVsdGlzaWcgd2lsbCBjb25zaXN0IG9mCnF1b3J1bV9icHMgcmVxdWlyZXMgdG8gcGFzcyB0aGUgbWluaW11bSBhbW91bnQgb2YgcmVxdWlyZWQgc2lnbmVycyBpbiBCUFMKaWYgbm90IHByZXNlbnQsIGRlZmF1bHQgaWYgMTAwJQAAAAAAAAppbml0aWFsaXplAAAAAAAEAAAAAAAAAARuYW1lAAAAEAAAAAAAAAALZGVzY3JpcHRpb24AAAAAEAAAAAAAAAAHbWVtYmVycwAAAAPqAAAAEwAAAAAAAAAKcXVvcnVtX2JwcwAAAAAD6AAAAAQAAAABAAAD6QAAA+0AAAAAAAAH0AAAAA1Db250cmFjdEVycm9yAAAA",
        "AAAAAAAAAAAAAAAbY3JlYXRlX3RyYW5zYWN0aW9uX3Byb3Bvc2FsAAAAAAcAAAAAAAAABnNlbmRlcgAAAAAAEwAAAAAAAAAFdGl0bGUAAAAAAAAQAAAAAAAAAAtkZXNjcmlwdGlvbgAAAAAQAAAAAAAAAAlyZWNpcGllbnQAAAAAAAATAAAAAAAAAAZhbW91bnQAAAAAAAYAAAAAAAAABXRva2VuAAAAAAAAEwAAAAAAAAAPZXhwaXJhdGlvbl9kYXRlAAAAA+gAAAAGAAAAAQAAA+kAAAPtAAAAAAAAB9AAAAANQ29udHJhY3RFcnJvcgAAAA==",
        "AAAAAAAAAAAAAAAWY3JlYXRlX3VwZGF0ZV9wcm9wb3NhbAAAAAAAAwAAAAAAAAAGc2VuZGVyAAAAAAATAAAAAAAAAA1uZXdfd2FzbV9oYXNoAAAAAAAD7gAAACAAAAAAAAAAD2V4cGlyYXRpb25fZGF0ZQAAAAPoAAAABgAAAAEAAAPpAAAD7QAAAAAAAAfQAAAADUNvbnRyYWN0RXJyb3IAAAA=",
        "AAAAAAAAAAAAAAANc2lnbl9wcm9wb3NhbAAAAAAAAAIAAAAAAAAABnNlbmRlcgAAAAAAEwAAAAAAAAALcHJvcG9zYWxfaWQAAAAABgAAAAEAAAPpAAAD7QAAAAAAAAfQAAAADUNvbnRyYWN0RXJyb3IAAAA=",
        "AAAAAAAAAAAAAAAQZXhlY3V0ZV9wcm9wb3NhbAAAAAIAAAAAAAAABnNlbmRlcgAAAAAAEwAAAAAAAAALcHJvcG9zYWxfaWQAAAAABgAAAAEAAAPpAAAD7QAAAAAAAAfQAAAADUNvbnRyYWN0RXJyb3IAAAA=",
        "AAAAAAAAAAAAAAATcXVlcnlfbXVsdGlzaWdfaW5mbwAAAAAAAAAAAQAAA+kAAAfQAAAADE11bHRpc2lnSW5mbwAAB9AAAAANQ29udHJhY3RFcnJvcgAAAA==",
        "AAAAAAAAAAAAAAAWcXVlcnlfbXVsdGlzaWdfbWVtYmVycwAAAAAAAAAAAAEAAAPpAAAD6gAAABMAAAfQAAAADUNvbnRyYWN0RXJyb3IAAAA=",
        "AAAAAAAAAAAAAAAOcXVlcnlfcHJvcG9zYWwAAAAAAAEAAAAAAAAAC3Byb3Bvc2FsX2lkAAAAAAYAAAABAAAD6QAAB9AAAAAIUHJvcG9zYWwAAAfQAAAADUNvbnRyYWN0RXJyb3IAAAA=",
        "AAAAAAAAAAAAAAAQcXVlcnlfc2lnbmF0dXJlcwAAAAEAAAAAAAAAC3Byb3Bvc2FsX2lkAAAAAAYAAAABAAAD6QAAA+oAAAPtAAAAAgAAABMAAAABAAAH0AAAAA1Db250cmFjdEVycm9yAAAA",
        "AAAAAAAAAAAAAAAWcXVlcnlfbGFzdF9wcm9wb3NhbF9pZAAAAAAAAAAAAAEAAAPpAAAABgAAB9AAAAANQ29udHJhY3RFcnJvcgAAAA==",
        "AAAAAAAAAAAAAAATcXVlcnlfYWxsX3Byb3Bvc2FscwAAAAAAAAAAAQAAA+kAAAPqAAAH0AAAAAhQcm9wb3NhbAAAB9AAAAANQ29udHJhY3RFcnJvcgAAAA==",
        "AAAAAAAAAAAAAAARaXNfcHJvcG9zYWxfcmVhZHkAAAAAAAABAAAAAAAAAAtwcm9wb3NhbF9pZAAAAAAGAAAAAQAAA+kAAAABAAAH0AAAAA1Db250cmFjdEVycm9yAAAA",
        "AAAABAAAAAAAAAAAAAAADUNvbnRyYWN0RXJyb3IAAAAAAAAOAAAAAAAAAAxVbmF1dGhvcml6ZWQAAAAAAAAAAAAAABJBbHJlYWR5SW5pdGlhbGl6ZWQAAAAAAAEAAAAAAAAAFkluaXRpYWxpemVUb29Mb3dRdW9ydW0AAAAAAAIAAAAAAAAAF0luaXRpYWxpemVUb29IaWdoUXVvcnVtAAAAAAMAAAAAAAAAFlVuYXV0aG9yaXplZE5vdEFNZW1iZXIAAAAAAAQAAAAAAAAADFRpdGxlVG9vTG9uZwAAAAUAAAAAAAAAEkRlc2NyaXB0aW9uVG9vTG9uZwAAAAAABgAAAAAAAAAOUHJvcG9zYWxDbG9zZWQAAAAAAAcAAAAAAAAAEFF1b3J1bU5vdFJlYWNoZWQAAAAIAAAAAAAAABBQcm9wb3NhbE5vdEZvdW5kAAAACQAAAAAAAAAPUHJvcG9zYWxFeHBpcmVkAAAAAAoAAAAAAAAAFUludmFsaWRFeHBpcmF0aW9uRGF0ZQAAAAAAAAsAAAAAAAAAEE1lbWJlcnNMaXN0RW1wdHkAAAAMAAAAAAAAABNaZXJvQWRkcmVzc1Byb3ZpZGVkAAAAAA0=",
        "AAAAAQAAAAAAAAAAAAAACFByb3Bvc2FsAAAABgAAAAAAAAASY3JlYXRpb25fdGltZXN0YW1wAAAAAAAGAAAAAAAAABRleHBpcmF0aW9uX3RpbWVzdGFtcAAAAAYAAAAAAAAAAmlkAAAAAAAGAAAAAAAAAAhwcm9wb3NhbAAAB9AAAAAMUHJvcG9zYWxUeXBlAAAAAAAAAAZzZW5kZXIAAAAAABMAAAAAAAAABnN0YXR1cwAAAAAH0AAAAA5Qcm9wb3NhbFN0YXR1cwAA",
        "AAAAAgAAAAAAAAAAAAAADFByb3Bvc2FsVHlwZQAAAAIAAAABAAAAAAAAAAtUcmFuc2FjdGlvbgAAAAABAAAH0AAAAAtUcmFuc2FjdGlvbgAAAAABAAAAAAAAAA5VcGRhdGVDb250cmFjdAAAAAAAAQAAA+4AAAAg",
        "AAAAAgAAAAAAAAAAAAAADlByb3Bvc2FsU3RhdHVzAAAAAAACAAAAAAAAAAAAAAAET3BlbgAAAAAAAAAAAAAABkNsb3NlZAAA",
        "AAAAAQAAAAAAAAAAAAAAC1RyYW5zYWN0aW9uAAAAAAUAAAAAAAAABmFtb3VudAAAAAAABgAAAAAAAAALZGVzY3JpcHRpb24AAAAAEAAAAAAAAAAJcmVjaXBpZW50AAAAAAAAEwAAAAAAAAAFdGl0bGUAAAAAAAAQAAAAAAAAAAV0b2tlbgAAAAAAABM=",
        "AAAAAQAAAAAAAAAAAAAADE11bHRpc2lnSW5mbwAAAAUAAAAAAAAAC2Rlc2NyaXB0aW9uAAAAABAAAAAAAAAAB21lbWJlcnMAAAAD6gAAABMAAAAAAAAABG5hbWUAAAAQAAAAAAAAAApxdW9ydW1fYnBzAAAAAAAEAAAAAAAAABB2ZXJzaW9uX3Byb3Bvc2FsAAAABA==",
        "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAACAAAAAAAAAAAAAAADUlzSW5pdGlhbGl6ZWQAAAAAAAAAAAAAAAAAAA9OYW1lRGVzY3JpcHRpb24AAAAAAAAAAAAAAAAJUXVvcnVtQnBzAAAAAAAAAAAAAAAAAAAITXVsdGlzaWcAAAAAAAAAAAAAAA5MYXN0UHJvcG9zYWxJZAAAAAAAAQAAAAAAAAAIUHJvcG9zYWwAAAABAAAABgAAAAEAAAAAAAAAElByb3Bvc2FsU2lnbmF0dXJlcwAAAAAAAQAAAAYAAAAAAAAAAAAAAAdWZXJzaW9uAA==",
      ]),
      options
    );
  }
  public readonly fromJSON = {
    initialize: this.txFromJSON<Result<void>>,
    create_transaction_proposal: this.txFromJSON<Result<void>>,
    create_update_proposal: this.txFromJSON<Result<void>>,
    sign_proposal: this.txFromJSON<Result<void>>,
    execute_proposal: this.txFromJSON<Result<void>>,
    query_multisig_info: this.txFromJSON<Result<MultisigInfo>>,
    query_multisig_members: this.txFromJSON<Result<Array<string>>>,
    query_proposal: this.txFromJSON<Result<Proposal>>,
    query_signatures: this.txFromJSON<
      Result<Array<readonly [string, boolean]>>
    >,
    query_last_proposal_id: this.txFromJSON<Result<u64>>,
    query_all_proposals: this.txFromJSON<Result<Array<Proposal>>>,
    is_proposal_ready: this.txFromJSON<Result<boolean>>,
  };
}
