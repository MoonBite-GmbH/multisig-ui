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
    contractId: "CALYAAVUBNAQA7PC6D4NE7TEUMDNBZVJEEWULCD7ERD6MHJKOBYMMIEJ",
  },
} as const;

export type DataKey =
  | { tag: "IsInitialized"; values: void }
  | { tag: "MultisigWasmHash"; values: void };

export const Errors = {};

export interface Client {
  /**
   * Construct and simulate a initialize transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  initialize: (
    { multisig_wasm_hash }: { multisig_wasm_hash: Buffer },
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
    },
  ) => Promise<AssembledTransaction<null>>;

  /**
   * Construct and simulate a deploy_new_multisig transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  deploy_new_multisig: (
    {
      deployer,
      salt,
      name,
      description,
      members,
      quorum_bps,
    }: {
      deployer: string;
      salt: Buffer;
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
    },
  ) => Promise<AssembledTransaction<string>>;
}

export class Client extends ContractClient {
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([
        "AAAAAAAAAAAAAAAKaW5pdGlhbGl6ZQAAAAAAAQAAAAAAAAASbXVsdGlzaWdfd2FzbV9oYXNoAAAAAAPuAAAAIAAAAAA=",
        "AAAAAAAAAAAAAAATZGVwbG95X25ld19tdWx0aXNpZwAAAAAGAAAAAAAAAAhkZXBsb3llcgAAABMAAAAAAAAABHNhbHQAAAPuAAAAIAAAAAAAAAAEbmFtZQAAABAAAAAAAAAAC2Rlc2NyaXB0aW9uAAAAABAAAAAAAAAAB21lbWJlcnMAAAAD6gAAABMAAAAAAAAACnF1b3J1bV9icHMAAAAAA+gAAAAEAAAAAQAAABM=",
        "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAAAgAAAAAAAAAAAAAADUlzSW5pdGlhbGl6ZWQAAAAAAAAAAAAAAAAAABBNdWx0aXNpZ1dhc21IYXNo",
      ]),
      options,
    );
  }

  public readonly fromJSON = {
    initialize: this.txFromJSON<null>,
    deploy_new_multisig: this.txFromJSON<string>,
  };
}
