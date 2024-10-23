import { ExchangeSDK, TestUtils } from '@exchange/sdk';
import { ChainId } from '@exchange/sdk-core';

import { ethers } from 'ethers';

export type Provider = ethers.providers.JsonRpcProvider;

const RPC_URL = 'http://127.0.0.1:8545';

const network = {
  name: 'local',
  chainId: ChainId.LOCALHOST,
  _defaultProvider: () => new ethers.providers.JsonRpcProvider(RPC_URL)
};

export const provider = new ethers.providers.StaticJsonRpcProvider(RPC_URL, network);

export const { signer, account } = TestUtils.setupConnection(provider);

export const sdk = new ExchangeSDK({
  signer,
  rpcUrl: RPC_URL,
  DEBUG: true
});

export const impersonate = async (account) => {
  const stop = await chain.impersonate(account);
  const provider = ethers.getDefaultProvider(network) as Provider;
  const signer = await provider.getSigner(account);
  const sdk = new ExchangeSDK({
    signer,
    DEBUG: true
  });

  return { sdk, stop };
};

export const chain = new TestUtils.BlockchainUtils(sdk.diamondSDK);
