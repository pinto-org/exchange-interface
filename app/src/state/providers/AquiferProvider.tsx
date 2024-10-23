import React, { useEffect } from 'react';

import { useAtom } from 'jotai';
import { useChainId } from 'wagmi';

import { Aquifer } from '@exchange/sdk';

import useSdk from 'src/utils/sdk/useSdk';

import { aquiferAtom } from '../atoms';

const useSetAquifer = () => {
  const [aquifer, setAquifer] = useAtom(aquiferAtom);

  const sdk = useSdk();
  const chainId = useChainId();

  useEffect(() => {
    const aquiferAddress = sdk.addresses.AQUIFER.get(sdk.chainId);
    setAquifer(new Aquifer(sdk, aquiferAddress));
  }, [sdk, chainId, setAquifer]);

  return aquifer;
};

const AquiferProvider = React.memo(({ children }: { children: React.ReactNode }) => {
  const aquifer = useSetAquifer();

  if (!aquifer) return null;

  return <>{children}</>;
});

export default AquiferProvider;
