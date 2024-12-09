import { useCallback } from 'react';

import { Well } from '@exchange/sdk';

import { queryKeys } from 'src/utils/query/queryKeys';
import { useChainScopedQuery } from 'src/utils/query/useChainScopedQuery';

export type EmaWindow = 24 | 168 | 720;

/**
 * Yields for a single token, for a single EMA window.
 */
export interface SiloTokenEMAYield {
  bean: number;
  ownership: number;
  stalk: number;
}

export type EMAWindows<T> = {
  ema24: T;
  ema168: T;
  ema720: T;
};

/**
 * Yields for a single token, across different EMA windows.
 */
export interface SiloTokenYield extends EMAWindows<number> {}

/**
 * API response from /silo/yields
 */
export interface SiloYieldsAPIResponse {
  ema: {
    [key in EmaWindow]: {
      beansPerSeason: string;
      effectiveWindow: number | EmaWindow;
    };
  };
  initType: 'NEW' | 'AVERAGE' | 'CUSTOM';
  season: number;
  yields: {
    [key in EmaWindow]: {
      [tokenAddress: string]: SiloTokenEMAYield;
    };
  };
}

const normalizeYields = (yields: SiloYieldsAPIResponse['yields'][EmaWindow]) => {
  // we use lowercase addresses as a token index, so we need to normalize them in case they're not
  const entries = Object.entries(yields).map(([key, value]) => [key.toLowerCase(), value]);
  return Object.fromEntries(entries) as SiloYieldsAPIResponse['yields'][EmaWindow];
};

export const useSiloAPYs = () => {
  const query = useChainScopedQuery<SiloYieldsAPIResponse>({
    queryKey: queryKeys.siloWellAPYs,
    queryFn: async () => {
      const res = await fetch(`https://api.pinto.money/silo/yield`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const result = await res.json();
      result.yields[24] = normalizeYields(result.yields[24]);
      result.yields[168] = normalizeYields(result.yields[168]);
      result.yields[720] = normalizeYields(result.yields[720]);

      return result;
    },

    staleTime: 1000 * 60,
    refetchOnWindowFocus: false
  });

  const getSiloAPYWithWell = useCallback(
    (well: Well | undefined) => {
      const lpToken = well?.lpToken;
      if (!query.data || !lpToken?.address) return undefined;

      return query.data.yields?.[720]?.[lpToken.address];
    },
    [query.data]
  );

  return {
    ...query,
    getSiloAPYWithWell
  };
};
