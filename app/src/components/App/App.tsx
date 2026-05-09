import React, { Suspense } from 'react';

import { Route, Routes } from 'react-router-dom';

import { Frame } from 'src/components/Frame/Frame';
import { NotFound } from 'src/pages/404';
import { Build } from 'src/pages/Build';
import { Create } from 'src/pages/Create';
import { Home } from 'src/pages/Home';
import { Liquidity } from 'src/pages/Liquidity';
import { Swap } from 'src/pages/Swap';
import { Well } from 'src/pages/Well';
import { Wells } from 'src/pages/Wells';
import { Settings } from 'src/settings';
import { useUpdateWindowDimensions } from 'src/utils/ui/useViewport';

import { ForceSupportedChainId } from './ForceSupportedChainId';

const Dev = import.meta.env.DEV
  ? React.lazy(() => import('src/pages/Dev').then((module) => ({ default: module.Dev })))
  : null;

export const App = ({}) => {
  useUpdateWindowDimensions();

  return (
    <>
      <ForceSupportedChainId />
      <Frame>
        <Routes>
          <Route index element={<Home />} />
          <Route path='/wells/:cid' element={<Wells />} />
          <Route path='/wells/:cid/:address' element={<Well />} />
          <Route path='/wells/:cid/:address/liquidity' element={<Liquidity />} />
          <Route path='/swap' element={<Swap />} />
          {/* <Route path='/build' element={<Build />} /> */}
          {/* <Route path="/create" element={<Create />} /> */}
          {Dev && (
            <Route
              path='/dev'
              element={
                <Suspense fallback={null}>
                  <Dev />
                </Suspense>
              }
            />
          )}
          <Route path='*' element={<NotFound />} />
        </Routes>
      </Frame>
    </>
  );
};
