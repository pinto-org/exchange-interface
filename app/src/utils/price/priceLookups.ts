import { ExchangeSDK } from '@exchange/sdk';
import { ChainId, TokenValue } from '@exchange/sdk-core';
import { ChainResolver } from '@exchange/sdk-core';

import { ChainlinkDataFeedContract__factory } from 'src/generated/types';
import { memoize } from 'src/utils/memoize';

import { Log } from '../logger';

/*
 * Price lookup methods
 *
 * For Chainlink, we get contract address from:
 * https://data.chain.link/ethereum/mainnet
 * Docs: https://docs.chain.link/data-feeds/price-feeds
 *
 */

const FEEDS: Record<number, Record<string, string>> = {
  [ChainId.BASE_MAINNET]: {
    /// ETH Data Feeds
    wstETH_ETH: '0x43a5C292A453A3bF3606fa856197f09D7B74251a',
    weETH_ETH: '0xFC1415403EbB0c693f9a7844b92aD2Ff24775C65',
    rETH_ETH: '0xf397bF97280B488cA19ee3093E81C0a77F02e9a5',

    /// USD Data Feeds
    cbBTC_USD: '0x07DA0E54543a844a80ABE69c8A12F22B3aA59f9D',
    cbETH_USD: '0xd7818272B9e248357d13057AAb0B417aF31E817d',
    ETH_USD: '0x71041dddad3595F9CEd3DcCFBe3D1F4b0a16Bb70',
    DAI_USD: '0x591e79239a7d679378eC8c847e5038150364C78F',
    USDC_USD: '0x7e860098F58bBFC8648a4311b374B1D669a2bc6B',
    USDT_USD: '0xf19d560eB8d2ADf07BD6D13ed03e1D11215721F9',
    SOL_USD: '0x975043adBb80fc32276CbF9Bbcfd4A601a12462D'
  }
};

type FeedId = keyof (typeof FEEDS)[keyof typeof FEEDS];

const chainlinkLookup = (feed: FeedId) => async (sdk: ExchangeSDK) => {
  const chainId = ChainResolver.resolveToMainnetChainId(sdk.chainId);
  const chainFeed = FEEDS[chainId];
  const address = chainFeed[feed];

  if (!chainFeed || !address) {
    Log.module('price').debug(`Unable to fetch price. No Chainlink lookup for feed: ${feed} on chainId: ${chainId}`);
    return null;
  }
  Log.module('price').debug(`Fetching ${sdk.tokens.findByAddress(address)?.symbol || address} price`);

  const contract = ChainlinkDataFeedContract__factory.connect(address, sdk.providerOrSigner);
  const { answer } = await contract.latestRoundData();
  const decimals = await contract.decimals();

  return TokenValue.fromBlockchain(answer, decimals);
};

const multiChainlinkLookup = (from: FeedId, to: FeedId) => async (sdk: ExchangeSDK) => {
  const [fromPrice, toPrice] = await Promise.all([chainlinkLookup(from)(sdk), chainlinkLookup(to)(sdk)]);

  if (fromPrice && toPrice) {
    return toPrice.mul(fromPrice);
  }

  return null;
};

const PINTO = async (sdk: ExchangeSDK) => {
  Log.module('price').debug('Fetching BEAN price');
  return sdk.diamondSDK.pinto.getPrice();
};

const PRICE_EXPIRY_TIMEOUT = 60 * 5; // 5 minute cache

// cache should automatically update when sdk instance is updated
export const PriceLookups: Record<string, (sdk: ExchangeSDK) => Promise<TokenValue>> = {
  PINTO: memoize(PINTO, PRICE_EXPIRY_TIMEOUT),
  ETH: memoize(chainlinkLookup('ETH_USD')),
  WETH: memoize(chainlinkLookup('ETH_USD'), PRICE_EXPIRY_TIMEOUT),
  USDC: memoize(chainlinkLookup('USDC_USD'), PRICE_EXPIRY_TIMEOUT),
  DAI: memoize(chainlinkLookup('DAI_USD'), PRICE_EXPIRY_TIMEOUT),
  USDT: memoize(chainlinkLookup('USDT_USD'), PRICE_EXPIRY_TIMEOUT),
  cbBTC: memoize(chainlinkLookup('cbBTC_USD'), PRICE_EXPIRY_TIMEOUT),
  cbETH: memoize(chainlinkLookup('cbETH_USD'), PRICE_EXPIRY_TIMEOUT),
  weETH: memoize(multiChainlinkLookup('weETH_ETH', 'ETH_USD'), PRICE_EXPIRY_TIMEOUT),
  wstETH: memoize(multiChainlinkLookup('wstETH_ETH', 'ETH_USD'), PRICE_EXPIRY_TIMEOUT),
  WSOL: memoize(chainlinkLookup('SOL_USD'), PRICE_EXPIRY_TIMEOUT)
};
