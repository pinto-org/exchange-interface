import { getDefaultConfig } from 'connectkit';
import { Chain, Transport } from 'viem';
import { http, createConfig } from 'wagmi';

import { ChainId } from '@exchange/sdk-core';

import { isPROD } from 'src/settings';

import {
  localFork,
  baseMainnet
  // testnet
} from './chains';
import { getRpcUrl } from './urls';

type ChainsConfig = readonly [Chain, ...Chain[]];

type TransportsConfig = Record<number, Transport>;

const WALLET_CONNECT_PROJECT_ID = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;

if (!WALLET_CONNECT_PROJECT_ID) {
  throw new Error('VITE_WALLETCONNECT_PROJECT_ID is not set');
}

const chains: ChainsConfig = isPROD ? [baseMainnet] : [localFork, baseMainnet];

const transports: TransportsConfig = isPROD
  ? {
      [baseMainnet.id]: http(getRpcUrl(ChainId.BASE_MAINNET))
    }
  : {
      [localFork.id]: http(localFork.rpcUrls.default.http[0]),
      [baseMainnet.id]: http(getRpcUrl(ChainId.BASE_MAINNET))
    };

const configObject = {
  chains,
  transports,
  // Required App Info
  appName: 'Basin',
  // Optional App Info
  appDescription: 'A Composable EVM-Native DEX',
  appUrl: 'https://basin.exchange', // your app's url
  appIcon: 'https://basin.exchange/favicon.svg', // your app's icon, no bigger than 1024x1024px (max. 1MB)
  walletConnectProjectId: WALLET_CONNECT_PROJECT_ID
};

// Add wallet connect if we have a project id env var

// Create the config object
export const config = createConfig(getDefaultConfig(configObject));
