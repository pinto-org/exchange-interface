import { addresses, ZERO_BN } from 'src/constants';

import { DiamondSDK } from './DiamondSDK';
import {
  TokenValue,
  Token,
  ERC20Token,
  NativeToken,
  SystemToken,
  getTokenIndex,
  getTokenSymbolIndex
} from '@exchange/sdk-core';
import { BigNumber } from 'ethers';

export type TokenBalance = {
  internal: TokenValue;
  external: TokenValue;
  total: TokenValue;
};

export class Tokens {
  // SDK
  private sdk: DiamondSDK;

  // Native
  public readonly ETH: NativeToken;

  // ERC-20
  public readonly PINTO: ERC20Token;
  public readonly CBBTC: ERC20Token;
  public readonly WETH: ERC20Token;
  public readonly CBETH: ERC20Token;
  public readonly USDC: ERC20Token;
  public readonly WSOL: ERC20Token;

  // Well LP
  public readonly PINTO_ETH_WELL_LP: ERC20Token;
  public readonly PINTO_CBETH_WELL_LP: ERC20Token;
  public readonly PINTO_CBBTC_WELL_LP: ERC20Token;
  public readonly PINTO_USDC_WELL_LP: ERC20Token;
  public readonly PINTO_WSOL_WELL_LP: ERC20Token;

  // System
  public readonly STALK: SystemToken;
  public readonly SEEDS: SystemToken;
  public readonly PODS: SystemToken;

  public readonly tokens: Set<Token>;

  public readonly wellUnderlying: Set<ERC20Token>;
  public readonly erc20Tokens: Set<ERC20Token>;
  public readonly balanceTokens: Set<Token>;
  public readonly systemTokens: Set<SystemToken>;

  public readonly wellLP: Set<Token>;
  public readonly wellLPAddresses: string[];

  public readonly whitelist: Set<Token>;
  public readonly whitelistAddresses: string[];

  public readonly tokenMap: Map<string, Token>;

  private symbol2Index: { [symbol: string]: string };

  constructor(sdk: DiamondSDK) {
    this.sdk = sdk;
    const map = new Map();

    ////////// Ethereum //////////
    const chainId = this.sdk.chainId;
    const providerOrSigner = this.sdk.providerOrSigner;

    this.ETH = new NativeToken(
      chainId,
      null,
      18,
      'ETH',
      {
        name: 'Ether',
        displayDecimals: 4,
        displayName: 'Ether'
      },
      providerOrSigner
    );

    map.set(getTokenIndex(this.ETH), this.ETH);

    ////////// System "Tokens" (non ERC-20) //////////

    this.STALK = new SystemToken(
      chainId,
      null,
      16,
      'STALK',
      {
        name: 'Stalk'
      },
      providerOrSigner
    );

    this.SEEDS = new SystemToken(
      chainId,
      null,
      6,
      'SEED',
      {
        name: 'Seeds'
      },
      providerOrSigner
    );

    this.PODS = new SystemToken(
      chainId,
      null,
      6,
      'PODS',
      {
        name: 'Pods'
      },
      providerOrSigner
    );

    map.set(getTokenIndex(this.STALK), this.STALK);
    map.set(getTokenIndex(this.SEEDS), this.SEEDS);
    map.set(getTokenIndex(this.PODS), this.PODS);
    this.systemTokens = new Set([this.STALK, this.SEEDS, this.PODS]);

    // ---------- WELL LP ----------
    this.PINTO_ETH_WELL_LP = new ERC20Token(
      chainId,
      addresses.PINTOETH_WELL.get(chainId),
      18,
      'PINTOETH',
      {
        name: 'PINTO:ETH LP', // see .name()
        displayName: 'PINTO:ETH Well LP',
        isLP: true,
        displayDecimals: 2
      },
      providerOrSigner
    );
    this.PINTO_CBETH_WELL_LP = new ERC20Token(
      chainId,
      addresses.PINTOCBETH_WELL.get(chainId),
      18,
      'PINTOCBETH',
      {
        name: 'PINTO:WBTC LP',
        displayName: 'PINTO:WBTC Well LP',
        isLP: true,
        displayDecimals: 2
      },
      providerOrSigner
    );
    this.PINTO_CBBTC_WELL_LP = new ERC20Token(
      chainId,
      addresses.PINTOCBBTC_WELL.get(chainId),
      18,
      'PINTOCBBTC',
      {
        name: 'PINTO:cbBTC LP',
        displayName: 'PINTO:cbBTC Well LP',
        isLP: true,
        displayDecimals: 2
      },
      providerOrSigner
    );
    this.PINTO_USDC_WELL_LP = new ERC20Token(
      chainId,
      addresses.PINTOUSDC_WELL.get(chainId),
      18,
      'PINTOUSDC',
      {
        name: 'PINTO:USDC LP',
        displayName: 'PINTO:USDC Well LP',
        isLP: true,
        displayDecimals: 2
      },
      providerOrSigner
    );
    this.PINTO_WSOL_WELL_LP = new ERC20Token(
      chainId,
      addresses.PINTOWSOL_WELL.get(chainId),
      18,
      'PINTOWSOL',
      {
        name: 'PINTO:WSOL LP',
        displayName: 'PINTO:WSOL Well LP',
        isLP: true,
        displayDecimals: 2
      },
      providerOrSigner
    );
    map.set(getTokenIndex(this.PINTO_ETH_WELL_LP), this.PINTO_ETH_WELL_LP);
    map.set(getTokenIndex(this.PINTO_CBETH_WELL_LP), this.PINTO_CBETH_WELL_LP);
    map.set(getTokenIndex(this.PINTO_CBBTC_WELL_LP), this.PINTO_CBBTC_WELL_LP);
    map.set(getTokenIndex(this.PINTO_USDC_WELL_LP), this.PINTO_USDC_WELL_LP);
    map.set(getTokenIndex(this.PINTO_WSOL_WELL_LP), this.PINTO_WSOL_WELL_LP);

    // ////////// ERC-20 Tokens //////////

    // ---------- PINTO ----------
    this.PINTO = new ERC20Token(
      chainId,
      addresses.PINTO.get(chainId),
      6,
      'PINTO',
      {
        name: 'Pinto',
        displayName: 'Pinto',
        displayDecimals: 2
      },
      providerOrSigner
    );
    map.set(getTokenIndex(this.PINTO), this.PINTO);

    //////////// BTC ////////////
    // cbBTC
    this.CBBTC = new ERC20Token(
      chainId,
      addresses.CBBTC.get(chainId),
      8,
      'cbBTC',
      {
        name: 'Coinbase Wrapped BTC',
        displayDecimals: 6
      },
      providerOrSigner
    );
    map.set(getTokenIndex(this.CBBTC), this.CBBTC);

    //////////// ETH ////////////
    // WETH
    this.WETH = new ERC20Token(
      chainId,
      addresses.WETH.get(chainId),
      18,
      'WETH',
      {
        name: 'Wrapped Ether',
        displayDecimals: 4
      },
      providerOrSigner
    );
    map.set(getTokenIndex(this.WETH), this.WETH);

    //////////// ETH-LSD ////////////
    // cbETH
    this.CBETH = new ERC20Token(
      chainId,
      addresses.CBETH.get(chainId),
      18,
      'cbETH',
      {
        name: 'Coinbase Wrapped Staked ETH',
        displayDecimals: 4
      },
      providerOrSigner
    );
    map.set(getTokenIndex(this.CBETH), this.CBETH);

    //////////// SOL ////////////
    this.WSOL = new ERC20Token(
      chainId,
      addresses.WSOL.get(chainId),
      9,
      'WSOL',
      {
        name: 'Wrapped SOL',
        displayDecimals: 4
      },
      providerOrSigner
    );
    map.set(getTokenIndex(this.WSOL), this.WSOL);

    //////////// STABLECOINS ////////////

    // USDC
    this.USDC = new ERC20Token(
      chainId,
      addresses.USDC.get(chainId),
      6,
      'USDC',
      {
        name: 'USD Coin',
        displayDecimals: 2
      },
      providerOrSigner
    );
    map.set(getTokenIndex(this.USDC), this.USDC);

    const balanceTokens = new Set<ERC20Token | NativeToken>();
    const erc20Tokens = new Set<ERC20Token>();
    const symbol2Index: { [symbol: string]: string } = {};

    map.forEach((token) => {
      const tokenIndex = getTokenIndex(token);
      symbol2Index[getTokenSymbolIndex(token)] = tokenIndex;

      balanceTokens.add(token);
      if (token instanceof ERC20Token) {
        erc20Tokens.add(token);
      }
    });

    ////////// Groups //////////

    const wellLP = [
      this.PINTO_ETH_WELL_LP,
      this.PINTO_CBETH_WELL_LP,
      this.PINTO_CBBTC_WELL_LP,
      this.PINTO_USDC_WELL_LP,
      this.PINTO_WSOL_WELL_LP
    ];

    const siloWhitelist = [this.PINTO, ...wellLP];

    this.tokenMap = map;
    this.wellLP = new Set(wellLP);
    this.wellLPAddresses = wellLP.map((t) => t.address);

    this.whitelist = new Set(siloWhitelist);
    this.whitelistAddresses = siloWhitelist.map((t) => t.address);

    this.erc20Tokens = erc20Tokens;
    this.balanceTokens = new Set([this.ETH, ...this.erc20Tokens]);
    this.wellUnderlying = new Set([this.WETH, this.CBETH, this.CBBTC, this.USDC]);
  }

  getERC20(address: string) {
    const token = this.tokenMap.get(address.toLowerCase());
    if (!token || !(token instanceof ERC20Token)) {
      return undefined;
    }
    return token;
  }

  isWhitelisted(token: Token) {
    return this.whitelist.has(token);
  }

  isWellLP(token: Token) {
    return this.wellLP.has(token);
  }

  // TODO: why do we need this?
  getMap(): Readonly<Map<string, Token>> {
    return Object.freeze(new Map(this.tokenMap));
  }

  /**
   * Get a Token by address
   */
  findByAddress(address: string): Token | undefined {
    return this.tokenMap.get(address.toLowerCase());
  }

  /**
   * Get a Token by symbol
   */
  findBySymbol(symbol: string): Token | undefined {
    const tokenIndex = this.symbol2Index[symbol.toLowerCase()];
    return this.tokenMap.get(tokenIndex);
  }

  /**
   * Destruct a string (address) | Token => address
   */
  private deriveAddress(value: string | Token) {
    return typeof value === 'string' ? value : value.address;
  }

  /**
   * Destruct a string (address) | Token => [Token, address]
   * @throws if `this.map` doesn't contain the Token.
   */
  private deriveToken(value: string | Token): [Token, string] {
    if (typeof value === 'string') {
      const _token = this.findByAddress(value);
      if (!_token) {
        throw new Error(`Unknown token: ${value}`);
      }
      return [_token, value];
    } else if (value?.address) {
      return [value, value.address];
    }
    throw new Error(`Unable to derive token from ${value}`);
  }

  /**
   * Convert TokenFacet.BalanceStructOutput to a TokenBalance.
   */
  private makeTokenBalance(
    token: Token,
    result: {
      internalBalance: BigNumber;
      externalBalance: BigNumber;
      totalBalance: BigNumber;
    }
  ): TokenBalance {
    return {
      internal: token.fromBlockchain(result.internalBalance),
      external: token.fromBlockchain(result.externalBalance),
      total: token.fromBlockchain(result.totalBalance)
    };
  }

  /**
   * Return a TokenBalance for a requested token.
   * Includes the Farmer's INTERNAL and EXTERNAL balance in one item.
   * This is the typical representation of balances within Beanstalk.
   */
  public async getBalance(_token: string | Token, _account?: string): Promise<TokenBalance> {
    const account = await this.sdk.getAccount(_account);

    // ETH cannot be stored in the INTERNAL balance.
    // Here we use the native getBalance() method and cast to a TokenBalance.
    if (_token === this.ETH) {
      const balance = await this.sdk.provider.getBalance(account);
      return this.makeTokenBalance(_token, {
        internalBalance: ZERO_BN,
        externalBalance: balance,
        totalBalance: balance
      });
    }

    // FIXME: use the ERC20 token contract directly to load decimals for parsing?
    const [token, tokenAddress] = this.deriveToken(_token);

    const balance = await this.sdk.contracts.diamond.getAllBalance(account, tokenAddress);

    return this.makeTokenBalance(token, balance);
  }

  /**
   * Return a TokenBalance struct for each requested token.
   * Includes the Farmer's INTERNAL and EXTERNAL balance in one item.
   * This is the typical representation of balances within Beanstalk.
   *
   * @todo discuss parameter inversion between getBalance() and getBalances().
   */
  public async getBalances(_account?: string, _tokens?: (string | Token)[]): Promise<Map<Token, TokenBalance>> {
    const account = await this.sdk.getAccount(_account);
    const tokens = _tokens || Array.from(this.erc20Tokens); // is this a good default?
    const tokenAddresses = tokens.map(this.deriveAddress);

    // FIXME: only allow ERC20 tokens with getBalance() method, or
    // override if token is NativeToken
    const balances = new Map<Token, TokenBalance>();
    const results = await this.sdk.contracts.diamond.getAllBalances(account, tokenAddresses);

    results.forEach((result, index) => {
      const token = this.findByAddress(tokenAddresses[index]);

      // FIXME: use the ERC20 token contract directly to load decimals for parsing?
      if (!token) throw new Error(`Unknown token: ${tokenAddresses}`);

      balances.set(token, this.makeTokenBalance(token, result));
    });

    return balances;
  }
}



// weETH
// this.WEETH = new ERC20Token(
//   chainId,
//   addresses.WEETH.get(chainId),
//   18,
//   'weETH',
//   {
//     name: 'Wrapped eETH',
//     displayDecimals: 4
//   },
//   providerOrSigner
// );
// map.set(getTokenIndex(this.WEETH), this.WEETH);

// // wstETH
// this.WSTETH = new ERC20Token(
//   chainId,
//   addresses.WSTETH.get(chainId),
//   18,
//   'wstETH',
//   {
//     name: 'Wrapped liquid staked Ether 2.0',
//     displayDecimals: 4
//   },
//   providerOrSigner
// );
// map.set(getTokenIndex(this.WSTETH), this.WSTETH);

// rETH
// this.RETH = new ERC20Token(
//   chainId,
//   addresses.RETH.get(chainId),
//   18,
//   'rETH',
//   {
//     name: 'Rocket Pool ETH',
//     displayDecimals: 4
//   },
//   providerOrSigner
// );
// map.set(getTokenIndex(this.RETH), this.RETH);
// USDT
// this.USDT = new ERC20Token(
//   chainId,
//   addresses.USDT.get(chainId),
//   6,
//   'USDT',
//   {
//     name: 'Tether USD',
//     displayDecimals: 2
//   },
//   providerOrSigner
// );
// map.set(getTokenIndex(this.USDT), this.USDT);

// DAI
// this.DAI = new ERC20Token(
//   chainId,
//   addresses.DAI.get(chainId),
//   18,
//   'DAI',
//   {
//     name: 'Dai Stablecoin',
//     displayDecimals: 4
//   },
//   providerOrSigner
// );
// map.set(getTokenIndex(this.DAI), this.DAI);

// ZRO
// this.ZRO = new ERC20Token(
//   chainId,
//   addresses.ZRO.get(chainId),
//   18,
//   'ZRO',
//   {
//     name: 'LayerZero',
//     displayDecimals: 4
//   },
//   providerOrSigner
// );
// map.set(getTokenIndex(this.ZRO), this.ZRO);