import { useMemo } from 'react';

import { Well, WellFunction } from '@exchange/sdk';

import useSdk from 'src/utils/sdk/useSdk';
import { stringEqual } from 'src/utils/string';

export const useIsConstantProduct2 = (param: Well | WellFunction | undefined | null) => {
  const sdk = useSdk();

  return useMemo(() => {
    const addresses = sdk.addresses;

    if (!param) return false;

    const wf = param instanceof Well ? param.wellFunction : param;

    return wf && stringEqual(addresses.CONSTANT_PRODUCT_2.get(sdk.chainId) || '', wf.address);
  }, [param, sdk.chainId, sdk.addresses]);
};
