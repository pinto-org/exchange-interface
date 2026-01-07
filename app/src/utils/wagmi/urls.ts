import { ChainId } from '@exchange/sdk-core';

const apiKey = import.meta.env.VITE_ALCHEMY_API_KEY;

export const vnetRpcUrl = import.meta.env.VITE_VNET_RPC_URL;

const LOCALHOST_RPC = 'http://localhost:8545';

if (!apiKey) {
  throw new Error('VITE_ALCHEMY_API_KEY is not set');
}

const RPC_URLS: Record<number, string> = {
  [ChainId.LOCALHOST]: LOCALHOST_RPC,
  [ChainId.BASE_MAINNET]: `https://base-mainnet.g.alchemy.com/v2/${apiKey}`,
  [ChainId.TESTNET]: vnetRpcUrl ?? LOCALHOST_RPC
};

export const getRpcUrl = (chainId: ChainId) => {
  const url = RPC_URLS[chainId];
  if (!url) {
    throw new Error(`No RPC URL for chainId: ${chainId}`);
  }
  return url;
};