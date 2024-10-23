import { atom } from 'jotai';

import { Aquifer } from '@exchange/sdk';

import { isDEV } from 'src/settings';

export const aquiferAtom = atom<Aquifer | null>(null);

if (isDEV) {
  aquiferAtom.debugLabel = 'aquifer';
}
