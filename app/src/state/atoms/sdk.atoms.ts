import { atom } from 'jotai';

import { ExchangeSDK } from '@exchange/sdk-wells';

import { isDEV } from 'src/settings';

export const sdkAtom = atom<ExchangeSDK | null>(null);

if (isDEV) {
  sdkAtom.debugLabel = 'sdk';
}
