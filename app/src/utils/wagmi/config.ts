import { getDefaultConfig } from 'connectkit';
import { Chain, Transport } from 'viem';
import { http, createConfig, Config } from 'wagmi';

import { ChainId } from '@exchange/sdk-core';

import { isDeployPreview, isDEV, isPROD } from 'src/settings';

import { localFork, baseMainnet, getBaseTestnet } from './chains';
import { getRpcUrl, vnetRpcUrl } from './urls';

type ChainsConfig = readonly [Chain, ...Chain[]];

type TransportsConfig = Record<number, Transport>;

const WALLET_CONNECT_PROJECT_ID = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;

if (!WALLET_CONNECT_PROJECT_ID) {
  throw new Error('VITE_WALLETCONNECT_PROJECT_ID is not set');
}

export let config: Config<readonly [Chain, ...Chain[]], Record<number, Transport>>;

export function setWagmiConfig(testnetRpcUrl: string | undefined = vnetRpcUrl) {
  const testnet = getBaseTestnet(testnetRpcUrl);

  const chains: ChainsConfig = (() => {
    if (isPROD) return [baseMainnet];
    if (isDeployPreview) {
      return testnet ? [testnet, baseMainnet] : [baseMainnet];
    }
    return testnet ? [testnet, localFork, baseMainnet] : [localFork, baseMainnet];
  })();

  const transports: TransportsConfig = (() => {
    const transportsConfig = {} as TransportsConfig;

    transportsConfig[baseMainnet.id] = http(getRpcUrl(ChainId.BASE_MAINNET));

    if (isPROD) return transportsConfig;

    // local fork
    if (isDEV) {
      transportsConfig[localFork.id] = http(localFork.rpcUrls.default.http[0]);
    }

    // Add testnet if we have a testnet rpc url
    if (testnetRpcUrl && testnet) {
      transportsConfig[testnet.id] = http(testnet.rpcUrls.default.http[0]);
    }

    return transportsConfig;
  })();

  const configProps = {
    chains: chains,
    transports: transports,
    // Required App Info
    appName: 'pinto exchange',
    // Optional App Info
    appDescription: 'A Composable EVM-Native DEX',
    appUrl: 'https://pinto.exchange', // your app's url
    appIcon: 'https://pinto.exchange/favicon.svg', // your app's icon, no bigger than 1024x1024px (max. 1MB)
    walletConnectProjectId: WALLET_CONNECT_PROJECT_ID
  };

  config = createConfig(getDefaultConfig(configProps));
}

setWagmiConfig();
