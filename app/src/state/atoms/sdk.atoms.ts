import { atom } from 'jotai';

import { WellsSDK } from '@exchange/sdk-wells';

import { isDEV } from 'src/settings';

export const sdkAtom = atom<WellsSDK | null>(null);

if (isDEV) {
  sdkAtom.debugLabel = 'sdk';
}
