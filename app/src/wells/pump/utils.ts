import { useCallback, useMemo } from 'react';

import { Well, ExchangeSDK } from '@exchange/sdk';

import { useSdkChainId } from 'src/utils/chain';
import { stringEqual } from 'src/utils/string';

export const useIsMultiFlowPump = (well: Well | undefined = undefined) => {
  const chainId = useSdkChainId();

  const getIsMultiFlow = useCallback(
    (_well: Well | undefined) => {
      const wellInstance = _well ?? well;

      return {
        isMultiFlow: wellInstance?.pumps?.some((pump) =>
          stringEqual(pump.address, ExchangeSDK.addresses.MULTI_FLOW_PUMP.get(chainId))
        )
      };
    },
    [chainId, well]
  );

  return useMemo(() => {
    return {
      ...getIsMultiFlow(well),
      getIsMultiFlow
    };
  }, [well, getIsMultiFlow]);
};
