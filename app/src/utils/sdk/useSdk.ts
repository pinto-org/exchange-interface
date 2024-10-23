import { useAtomValue } from 'jotai';

import { ExchangeSDK } from '@exchange/sdk';

import { sdkAtom } from 'src/state/atoms';

export default function useSdk(): ExchangeSDK {
  const sdk = useAtomValue(sdkAtom);
  if (!sdk) {
    throw new Error('Expected sdk to be used within BeanstalkSDK context');
  }

  return sdk;
}
