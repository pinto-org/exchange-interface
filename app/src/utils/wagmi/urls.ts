import { ChainId } from '@exchange/sdk-core';

const apiKey = import.meta.env.VITE_ALCHEMY_API_KEY;

if (!apiKey) {
  throw new Error('VITE_ALCHEMY_API_KEY is not set');
}

const RPC_URLS: Record<number, string> = {
  [ChainId.LOCALHOST]: 'http://localhost:8545',
  [ChainId.BASE_MAINNET]: `https://base-mainnet.g.alchemy.com/v2/${apiKey}`,
  [ChainId.TESTNET]: ''
};

export const getRpcUrl = (chainId: ChainId) => {
  const url = RPC_URLS[chainId];
  if (!url) {
    throw new Error(`No RPC URL for chainId: ${chainId}`);
  }
  return url;
};
