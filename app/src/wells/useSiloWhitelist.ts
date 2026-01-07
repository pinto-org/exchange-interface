import { useCallback } from 'react';

import { Well } from '@exchange/sdk';

import useSdk from 'src/utils/sdk/useSdk';

export const useSiloWhitelist = () => {
  const sdk = useSdk();

  const getIsWhitelisted = useCallback(
    (well: Well | undefined) => {
      if (!well?.lpToken) return false;
      const token = sdk.tokens.findByAddress(well.lpToken.address);
      return Boolean(token && sdk.tokens.whitelist.has(token));
    },
    [sdk.tokens]
  );

  const getSeedsWithWell = useCallback((well: Well | undefined) => {
    if (!well?.lpToken) return undefined;
    return well.lpToken.amount(1); // TODO: fix this
    // return sdk.tokens.findByAddress(well.lpToken.address)?.getSeeds();
  }, []);

  return {
    getIsWhitelisted,
    getSeedsWithWell
  } as const;
};
