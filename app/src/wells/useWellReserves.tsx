import { Well } from '@exchange/sdk';

import { useChainScopedQuery } from 'src/utils/query/useChainScopedQuery';
import useSdk from 'src/utils/sdk/useSdk';

export const useWellReserves = (well: Well) => {
  const sdk = useSdk();

  const { data, isLoading, error, refetch, isFetching } = useChainScopedQuery({
    queryKey: ['well', sdk, well.address, 'reserves'],

    queryFn: async () => well.getReserves(),

    staleTime: Infinity,
    refetchOnWindowFocus: false
  });

  return { reserves: data, loading: isLoading, error, refetch, isFetching };
};
