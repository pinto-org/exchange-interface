import { Token, ERC20Token, NativeToken } from '@exchange/sdk-core';
import { ExchangeSDK } from './ExchangeSDK';
import { getTokenIndex, getTokenSymbolIndex } from './utils';

export type TokenSTokensymbol = {
  [symbol: string]: Token;
};

export class Tokens {
  private static sdk: ExchangeSDK;

  private tokenMap = new Map<string, Token>();

  private symbol2Index: { [symbol: string]: string };

  readonly tokens = new Set<Token>();

  readonly erc20Tokens = new Map<string, ERC20Token>();

  readonly PINTO: ERC20Token;

  readonly CBBTC: ERC20Token;

  readonly ETH: NativeToken;
  readonly WETH: ERC20Token;
  readonly CBETH: ERC20Token;
  readonly WSTETH: ERC20Token;
  readonly WEETH: ERC20Token;
  readonly RETH: ERC20Token;

  readonly USDC: ERC20Token;
  readonly USDT: ERC20Token;
  readonly DAI: ERC20Token;
  readonly ZRO: ERC20Token;

  constructor(sdk: ExchangeSDK) {
    Tokens.sdk = sdk;

    const cid = Tokens.sdk.chainId;
    const provider = Tokens.sdk.providerOrSigner;

    // ---------- Native Tokens ----------
    // ETH
    this.ETH = new NativeToken(cid, null, 18, 'ETH', { name: 'Ether', displayDecimals: 4 }, provider);
    this.tokens.add(this.ETH);

    // ---------- ERC20 Tokens ----------

    // PINTO
    this.PINTO = new ERC20Token(
      cid,
      sdk.addresses.PINTO.get(cid),
      6,
      'PINTO',
      {
        name: 'PINTO',
        displayDecimals: 2
      },
      provider
    );
    this.tokens.add(this.PINTO);

    //////////// BTC ////////////
    // cbBTC
    this.CBBTC = new ERC20Token(
      cid,
      sdk.addresses.CBBTC.get(cid),
      8,
      'cbBTC',
      {
        name: 'Coinbase Wrapped BTC',
        displayDecimals: 6
      },
      provider
    );
    this.tokens.add(this.CBBTC);

    //////////// ETH ////////////
    // WETH
    this.WETH = new ERC20Token(
      cid,
      sdk.addresses.WETH.get(cid),
      18,
      'WETH',
      {
        name: 'Wrapped Ether',
        displayDecimals: 4
      },
      provider
    );
    this.tokens.add(this.WETH);

    //////////// ETH-LSD ////////////
    // cbETH
    this.CBETH = new ERC20Token(
      cid,
      sdk.addresses.CBETH.get(cid),
      18,
      'cbETH',
      {
        name: 'Coinbase Wrapped Staked ETH',
        displayDecimals: 4
      },
      provider
    );
    this.tokens.add(this.CBETH);

    // weETH
    this.WEETH = new ERC20Token(
      cid,
      sdk.addresses.WEETH.get(cid),
      18,
      'weETH',
      {
        name: 'Wrapped eETH',
        displayDecimals: 4
      },
      provider
    );
    this.tokens.add(this.WEETH);

    // wstETH
    this.WSTETH = new ERC20Token(
      cid,
      sdk.addresses.WSTETH.get(),
      18,
      'wstETH',
      {
        name: 'Wrapped liquid staked Ether 2.0',
        displayDecimals: 4
      },
      provider
    );
    this.tokens.add(this.WSTETH);

    // rETH
    this.RETH = new ERC20Token(
      cid,
      sdk.addresses.RETH.get(cid),
      18,
      'rETH',
      {
        name: 'Rocket Pool ETH',
        displayDecimals: 4
      },
      provider
    );
    this.tokens.add(this.RETH);

    //////////// STABLECOINS ////////////

    // USDC
    this.USDC = new ERC20Token(
      cid,
      sdk.addresses.USDC.get(Tokens.sdk.chainId),
      6,
      'USDC',
      {
        name: 'USD Coin',
        displayDecimals: 2
      },
      provider
    );
    this.tokens.add(this.USDC);

    // USDT
    this.USDT = new ERC20Token(
      cid,
      sdk.addresses.USDT.get(Tokens.sdk.chainId),
      6,
      'USDT',
      {
        name: 'Tether USD',
        displayDecimals: 2
      },
      provider
    );
    this.tokens.add(this.USDT);

    // DAI
    this.DAI = new ERC20Token(
      cid,
      sdk.addresses.DAI.get(Tokens.sdk.chainId),
      18,
      'DAI',
      {
        name: 'Dai Stablecoin',
        displayDecimals: 4
      },
      provider
    );
    this.tokens.add(this.DAI);

    // ZRO
    this.ZRO = new ERC20Token(
      cid,
      sdk.addresses.ZRO.get(cid),
      18,
      'ZRO',
      {
        name: 'LayerZero',
        displayDecimals: 4
      },
      provider
    );
    this.tokens.add(this.ZRO);

    this.tokenMap = new Map();
    this.erc20Tokens = new Map();

    this.symbol2Index = {};

    this.tokens.forEach((token) => {
      const tokenIndex = getTokenIndex(token);

      this.tokenMap.set(tokenIndex, token);
      this.symbol2Index[getTokenSymbolIndex(token)] = tokenIndex;

      if (token instanceof ERC20Token) {
        this.erc20Tokens.set(tokenIndex, token);
      }
    });
  }

  /**
   * Find a token by address
   */
  findByAddress(address: string): Token | undefined {
    return this.tokenMap.get(address.toLowerCase());
  }

  /**
   * Find a Token by symbol
   */
  findBySymbol(symbol: string): Token | undefined {
    const index = this.symbol2Index[symbol.toLowerCase()];
    return this.tokenMap.get(index);
  }
}
