import { useMemo } from 'react';

import { Pump } from '@exchange/sdk';

import { useWells } from 'src/wells/useWells';

export const usePumps = () => {
  const { data: wells } = useWells();

  return useMemo(() => {
    if (!wells || !wells.length) return [];

    const pumpMap: Record<string, Pump> = {};

    for (const well of wells) {
      for (const pump of well.pumps || []) {
        const pumpAddress = pump.address.toLowerCase();
        if (pumpAddress in pumpMap) continue;
        pumpMap[pumpAddress] = pump;
      }
    }

    return Object.values(pumpMap);
  }, [wells]);
};
