import { useAtomValue } from 'jotai';

import { WellsSDK } from '@exchange/sdk-wells';

import { sdkAtom } from 'src/state/atoms';

export default function useSdk(): WellsSDK {
  const sdk = useAtomValue(sdkAtom);
  if (!sdk) {
    throw new Error('Expected sdk to be used within BeanstalkSDK context');
  }

  return sdk;
}
