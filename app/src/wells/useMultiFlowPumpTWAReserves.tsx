import { useCallback } from 'react';

import { multicall } from '@wagmi/core';

import { Well } from '@exchange/sdk';
import { TokenValue } from '@exchange/sdk-core';

import MULTI_PUMP_ABI from 'src/abi/MULTI_PUMP_ABI.json';
import { useChainScopedQuery } from 'src/utils/query/useChainScopedQuery';
import useSdk from 'src/utils/sdk/useSdk';
import { config } from 'src/utils/wagmi/config';

import { useIsMultiFlowPump } from './pump/utils';
import { useSiloWhitelist } from './useSiloWhitelist';
import { useWells } from './useWells';

export const useMultiFlowPumpTWAReserves = () => {
  const { data: wells } = useWells();
  const { getIsWhitelisted } = useSiloWhitelist();
  const sdk = useSdk();
  const { getIsMultiFlow } = useIsMultiFlowPump();

  const query = useChainScopedQuery({
    queryKey: ['wells', 'multiFlowPumpTWAReserves'],

    queryFn: async () => {
      const whitelistedWells = (wells || []).filter((well) => {
        const isMultiflow = getIsMultiFlow(well).isMultiFlow && getIsWhitelisted(well);
        const hasReserves = well.reserves?.every((value) => value.gt(0));
        return isMultiflow && hasReserves;
      });

      const [{ timestamp: seasonTimestamp }, ...wellOracleSnapshots] = await Promise.all([
        sdk.diamondSDK.contracts.diamond.time(),
        ...whitelistedWells.map((well) =>
          sdk.diamondSDK.contracts.diamond.wellOracleSnapshot(well.address, {}).catch((e) => {
            console.error('e: ', e);
            return null;
          })
        )
      ]);

      const calls = whitelistedWells.reduce<any[]>((prev, well: Well, idx) => {
        const pumps = well.pumps;
        if (!pumps?.length || pumps.length > 1) return prev;

        const pump = pumps[0];
        prev.push({
          address: pump.address as `0x${string}`,
          abi: MULTI_PUMP_ABI,
          functionName: 'readTwaReserves',
          args: [well.address, wellOracleSnapshots[idx], seasonTimestamp.toString(), pump.data]
        });

        return prev;
      }, []);

      const twaReservesResult: any[] = await multicall(config, { contracts: calls }).catch((e) => {
        console.error('e: ', e);
        return [];
      });

      if (!twaReservesResult.length) return {};

      const mapping: Record<string, TokenValue[]> = {};

      whitelistedWells.forEach((well: Well, idx) => {
        const twa = [TokenValue.ZERO, TokenValue.ZERO];

        const pumps = well.pumps;
        const indexedResult = twaReservesResult[idx];
        
        if (!pumps?.length || pumps.length > 1 || indexedResult.error) return;
        
        const reserves = indexedResult?.result?.[0];
        const token1 = well.tokens?.[0];
        const token2 = well.tokens?.[1];

        if (token1 && token2 && reserves.length === 2 && reserves.length === 2) {
          twa[0] = twa[0].add(TokenValue.fromBlockchain(reserves[0], token1.decimals));
          twa[1] = twa[1].add(TokenValue.fromBlockchain(reserves[1], token2.decimals));
        }

        /// In case there is more than one pump, divide the reserves by the number of pumps
        /// Is this how to handle the case where there is more than one pump?
        mapping[well.address.toLowerCase()] = [twa[0], twa[1]];
      });
      return mapping;
    },
    retry: false,
    staleTime: 1000 * 60 * 20,
    enabled: !!wells?.length,
    refetchOnMount: true
  });

  const getTWAReservesWithWell = useCallback(
    (well: Well | undefined) => {
      if (!well || !query.data) return undefined;

      return query.data[well.address.toLowerCase()];
    },
    [query.data]
  );

  return { ...query, getTWAReservesWithWell };
};
