import { ChainId, ChainResolver } from '@exchange/sdk-core';

import useSdk from './sdk/useSdk';

/**
 * Returns the current chainId.
 *
 * We want to use the chainId to prevent the possibility of a race condition where we are using an outdated sdk to fetch data.
 *
 */
export function useSdkChainId() {
  return useSdk().chainId;
}

export function useResolvedChainId() {
  const sdkChainId = useSdkChainId();

  return ChainResolver.resolveToMainnetChainId(sdkChainId);
}

export const useChainExplorer = () => {
  const chainId = useResolvedChainId();

  return getChainExplorer(chainId);
};

export const getChainExplorer = (chainId: ChainId) => {
  const url = chain2ExplorerUrl(chainId);
  const name = chain2ExplorerName(chainId);

  return {
    url,
    name,
    address: (address: string) => `${url}/address/${address}`,
    tx: (tx: string) => `${url}/tx/${tx}`
  };
};

export const chain2ExplorerName = (chainId: number) => {
  switch (chainId) {
    case ChainId.BASE_MAINNET:
      return 'BaseScan';
    case 42161:
      return 'Arbiscan';
    case 1:
      return 'Etherscan';
    default:
      return 'BaseScan';
  }
};

export const chain2ExplorerUrl = (_chainId: number) => {
  const chainId = ChainResolver.resolveToMainnetChainId(_chainId) as number;
  switch (chainId) {
    case ChainId.BASE_MAINNET:
      return 'https://basescan.org';
    case 42161:
      return 'https://arbiscan.io';
    case 1:
      return 'https://etherscan.io';
    default:
      return 'https://basescan.org';
  }
};