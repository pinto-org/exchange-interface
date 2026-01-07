/**
 * List of supported chains
 */
export enum ChainId {
  BASE_MAINNET = 8453,
  LOCALHOST = 1337,
  TESTNET = 41337
}

export type TestnetChainId = ChainId.LOCALHOST | ChainId.TESTNET;

export type MainnetChainId = ChainId.BASE_MAINNET;

/**
 * These chains are forks of mainnet,
 * therefore they use the same token addresses as mainnet.
 *
 * - LOCALHOST
 * - TESTNET
 */
export const TESTNET_CHAINS: Readonly<Set<ChainId>> = new Set([ChainId.LOCALHOST, ChainId.TESTNET]);

/**
 * Mainnet chains
 *
 */
export const MAINNET_CHAINS: Readonly<Set<ChainId>> = new Set([ChainId.BASE_MAINNET]);
