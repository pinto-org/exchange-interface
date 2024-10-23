import { defineChain } from 'viem';

import { ChainId } from '@exchange/sdk-core';

import { getRpcUrl } from './urls';

export const localFork = defineChain({
  id: ChainId.LOCALHOST,
  name: 'localhost:8545 - Base',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: [getRpcUrl(ChainId.LOCALHOST)] }
  },
  contracts: {
    ensRegistry: {
      address: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e'
    },
    ensUniversalResolver: {
      address: '0xE4Acdd618deED4e6d2f03b9bf62dc6118FC9A4da',
      blockCreated: 16773775
    },
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 14353601
    }
  }
});

export const baseMainnet = defineChain({
  id: ChainId.BASE_MAINNET,
  name: 'Ethereum',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: {
      http: [getRpcUrl(ChainId.BASE_MAINNET)]
    }
  },
  blockExplorers: {
    default: {
      name: 'Etherscan',
      url: 'https://etherscan.io',
      apiUrl: 'https://api.etherscan.io/api'
    }
  },
  contracts: {
    ensRegistry: {
      address: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e'
    },
    ensUniversalResolver: {
      address: '0xce01f8eee7E479C928F8919abD53E553a36CeF67',
      blockCreated: 19_258_213
    },
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 14_353_601
    }
  }
});

export const testnet = defineChain({
  id: ChainId.TESTNET,
  name: 'Testnet',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: {
      http: [getRpcUrl(ChainId.TESTNET)]
    }
  },
  blockExplorers: {
    default: {
      name: 'Arbiscan',
      url: 'https://arbiscan.io',
      apiUrl: 'https://api.arbiscan.io/api'
    }
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 7654707
    }
  }
});
