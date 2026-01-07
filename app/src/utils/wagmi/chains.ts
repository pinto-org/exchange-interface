import { defineChain } from 'viem';
import { base as baseMainnetViem } from 'viem/chains';

import { ChainId } from '@exchange/sdk-core';

import { getRpcUrl, vnetRpcUrl } from './urls';

export const localFork = defineChain({
  ...baseMainnetViem,
  id: ChainId.LOCALHOST,
  name: 'localhost:8545 - Base',
  rpcUrls: {
    default: { http: [getRpcUrl(ChainId.LOCALHOST)] }
  }
});

export const baseMainnet = defineChain({
  ...baseMainnetViem,
  rpcUrls: {
    default: {
      http: [getRpcUrl(ChainId.BASE_MAINNET)]
    }
  }
});

export const getBaseTestnet = (testnetRpcUrl: string | undefined = vnetRpcUrl) => {
  if (!testnetRpcUrl) return null;

  return defineChain({
    ...baseMainnetViem,
    id: ChainId.TESTNET,
    name: 'Testnet - Base',
    rpcUrls: {
      default: {
        http: [testnetRpcUrl]
      }
    }
  });
};