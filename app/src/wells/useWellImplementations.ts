import { multicall } from '@wagmi/core';

import { ExchangeSDK } from '@exchange/sdk';

import { queryKeys } from 'src/utils/query/queryKeys';
import { useChainScopedQuery } from 'src/utils/query/useChainScopedQuery';
import useSdk from 'src/utils/sdk/useSdk';
import { config } from 'src/utils/wagmi/config';

import { useAquifer } from './aquifer/aquifer';
import { useWells } from './useWells';

const aquiferAbiSnippet = [
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'wellImplementation',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  }
] as const;

const getCallObjects = (aquiferAddress: string, addresses: string[]) => {
  return addresses.map((address) => ({
    address: aquiferAddress as '0x{string}',
    abi: aquiferAbiSnippet,
    functionName: 'wellImplementation',
    args: [address]
  }));
};

const zeroResult = '0x0000000000000000000000000000000000000000';

export const useWellImplementations = () => {
  const { data: wells } = useWells();
  const sdk = useSdk();
  const aquifer = useAquifer();

  const addresses = (wells || []).map((well) => well.address);

  const query = useChainScopedQuery({
    queryKey: queryKeys.wellImplementations(addresses),
    queryFn: async () => {
      if (!wells || !wells.length) return [];

      return multicall(config, {
        contracts: getCallObjects(aquifer.address, addresses)
      });
    },
    select: (data) => {
      return addresses.reduce<Record<string, string>>((prev, curr, i) => {
        const result = data[i];

        if (sdk.diamondSDK.pools.getWellByLPToken(curr.toLowerCase())) if (result.error) return prev;
        if (result.result) {
          const isWhitelisted = sdk.diamondSDK.pools.getWellByLPToken(curr.toLowerCase());
          if (result.result === zeroResult && isWhitelisted) {
            prev[curr.toLowerCase()] = ExchangeSDK.addresses.WELL_UPGRADEABLE.get().toLowerCase();
            return prev;
          }
          prev[curr.toLowerCase()] = result.result.toLowerCase() as string;
        }
        return prev;
      }, {});
    },
    enabled: !!addresses.length,
    staleTime: Infinity
  });

  return query;
};
