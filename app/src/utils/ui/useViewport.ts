import { useEffect } from 'react';

import { useAtom, useAtomValue } from 'jotai';

import { BP_GAP, mediaSizes } from 'src/breakpoints';
import { isDesktopAtom, isMobileAtom, isTabletAtom } from 'src/state/atoms/react/breakpoints.atoms';

const useIsUpdateIsMobile = () => {
  const [value, setValue] = useAtom(isMobileAtom);

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${mediaSizes.mobile - BP_GAP}px)`);

    mediaQuery.addEventListener('change', (event) => setValue(event.matches));

    return () => {
      mediaQuery.removeEventListener('change', (event) => setValue(event.matches));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return value;
};

const useIsUpdateIsTablet = () => {
  const [value, setValue] = useAtom(isTabletAtom);

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      `@media (min-width: ${mediaSizes.mobile}px) and (max-width: ${mediaSizes.tablet - BP_GAP}px)`
    );

    mediaQuery.addEventListener('change', (event) => setValue(event.matches));

    return () => {
      mediaQuery.removeEventListener('change', (event) => setValue(event.matches));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return value;
};

const useUpdateIsDesktop = () => {
  const [value, setValue] = useAtom(isDesktopAtom);

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(min-width: ${mediaSizes.desktop}px)`);

    mediaQuery.addEventListener('change', (event) => setValue(event.matches));

    return () => {
      mediaQuery.removeEventListener('change', (event) => setValue(event.matches));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return value;
};

export const useUpdateWindowDimensions = () => {
  useIsUpdateIsMobile();
  useIsUpdateIsTablet();
  useUpdateIsDesktop();
};

export const useViewportSM = () => {
  return useAtomValue(isMobileAtom);
};

export const useViewportMD = () => {
  return useAtomValue(isTabletAtom);
};

export const useViewportLG = () => {
  return useAtomValue(isDesktopAtom);
};
