import { ethers } from 'ethers';
import { TokenValue } from '@exchange/sdk-core';

/**
 * A Deposit represents an amount of a Whitelisted Silo Token
 * that has been added to the Silo.
 */
export type Deposit<T extends any = TokenValue> = {
  /** Deposit ID */
  id: ethers.BigNumber;
  /** The Stem is the ID of the deposit. */
  stem: ethers.BigNumber;
  /** */
  // season: ethers.BigNumber | undefined;
  /** The amount of this Deposit that was created, denominated in the underlying Token. */
  amount: T;
};

/**
 * A "Silo Balance" provides all information about a Farmer's deposits of a
 * Whitelisted Silo Token.
 */
export type TokenSiloBalance<T extends any = TokenValue> = {
  /** The total amount of this Token currently in the Deposited state. */
  amount: T;
  /** The total amount of this Token that is available to Convert. Excludes germinating deposits */
  convertibleAmount: T;
  /** All Deposit crates. */
  deposits: Deposit<T>[];
};
