import { BasinWell__factory, BasinWell as BasinWellContract } from 'src/constants/generated';
import Pool, { Reserves } from './Pool';
import { TokenValue, ERC20Token, Token } from '@exchange/sdk-core';
import { CallOverrides, ethers } from 'ethers';

export class BasinWell extends Pool {
  public getContract(): BasinWellContract {
    return BasinWell__factory.connect(this.address, Pool.sdk.providerOrSigner);
  }

  public getReserves() {
    Pool.sdk.debug(`BasinWell.getReserves(): ${this.address} ${this.name} on chain ${this.chainId}`);

    return this.getContract()
      .getReserves()
      .then((result) => [TokenValue.fromBlockchain(result[0], 0), TokenValue.fromBlockchain(result[1], 0)] as Reserves);
  }

  getPairToken(token: Token) {
    if (this.tokens.length !== 2) {
      throw new Error('Cannot get pair token for non-pair well');
    }

    const [token0, token1] = this.tokens;

    if (!token0.equals(token) && !token1.equals(token)) {
      throw new Error(`Invalid token. ${token.symbol} is not an underlying token of well ${this.name}`);
    }

    return token.equals(token0) ? token1 : token0;
  }

  // Ensure tokens are in the correct order
  async updateTokenIndexes() {
    const data = await this.getContract().tokens();
    if (!data || data.length !== 2) {
      throw new Error(`could not validate well tokens for ${this.name}`);
    }

    const first = data[0].toLowerCase();
    const thisFirst = this.tokens[0].address.toLowerCase();

    if (first !== thisFirst) {
      this.tokens.reverse();
    }
  }

  async getAddLiquidityOut(amounts: TokenValue[]): Promise<TokenValue> {
    return this.getContract()
      .getAddLiquidityOut(amounts.map((a) => a.toBigNumber()))
      .then((result) => this.lpToken.fromBlockchain(result));
  }

  async getRemoveLiquidityOutEqual(amount: TokenValue): Promise<TokenValue[]> {
    return this.getContract()
      .getRemoveLiquidityOut(amount.toBigNumber())
      .then((result) => this.tokens.map((token, i) => token.fromBlockchain(result[i])));
  }

  async getRemoveLiquidityOutOneToken(lpAmountIn: TokenValue, tokenOut: ERC20Token): Promise<TokenValue> {
    const tokenIndex = this.tokens.findIndex((token) => token.equals(tokenOut));
    if (tokenIndex < 0) {
      throw new Error(`Token ${tokenOut.symbol} does not underly ${this.name}`);
    }

    return this.getContract()
      .getRemoveLiquidityOneTokenOut(lpAmountIn.toBigNumber(), tokenOut.address)
      .then((result) => tokenOut.fromBlockchain(result));
  }

  /**
   * Gets the amount of `fromToken` needed in order to receive a specific amount of `toToken`
   * @param fromToken The token to swap from
   * @param toToken The token to swap to
   * @param amountOut The amount of `toToken` desired
   * @return amountIn The amount of `fromToken` that must be spent
   */
  async swapToQuote(
    fromToken: Token,
    toToken: Token,
    amountOut: TokenValue,
    overrides?: CallOverrides
  ): Promise<TokenValue> {
    const from = fromToken.address;
    const to = toToken.address;
    const amount = amountOut.toBigNumber();
    const quote = await this.getContract().getSwapIn(from, to, amount, overrides ?? {});

    return fromToken.fromBlockchain(quote);
  }

  /**
   * Gets the amount of `toToken` received for swapping an amount of `fromToken`.
   * @param fromToken The token to swap from
   * @param toToken The token to swap to
   * @param amountIn The amount of `fromToken` to spend
   * @return amountOut The amount of `toToken` to receive
   */
  async swapFromQuote(
    fromToken: Token,
    toToken: Token,
    amountIn: TokenValue,
    overrides?: CallOverrides
  ): Promise<TokenValue> {
    this.validateToken(fromToken, 'fromToken');
    this.validateToken(toToken, 'toToken');
    this.validateAmount(amountIn, 'amountIn');

    const amount = await this.getContract().getSwapOut(
      fromToken.address,
      toToken.address,
      amountIn.toBigNumber(),
      overrides ?? {}
    );

    return toToken.fromBlockchain(amount);
  }

  private validateToken(token: Token, name: string) {
    if (!(token instanceof ERC20Token)) {
      throw new Error(`${name} is not an instance of ERC20Token`);
    }

    this.validateAddress(token.address, name);
  }

  private validateAddress(address: string, name: string) {
    if (!ethers.utils.isAddress(address)) {
      throw new Error(`${name} is not a valid address`);
    }
  }

  private validateAmount(value: TokenValue, name: string) {
    if (!(value instanceof TokenValue)) {
      throw new Error(`${name} is not an instance of TokenValue`);
    }
    if (value.lte(TokenValue.ZERO)) {
      throw new Error(`${name} must be greater than zero`);
    }
    if (value.gte(TokenValue.MAX_UINT256)) {
      throw new Error(`${name} must be less than MAX_UINT256`);
    }
  }
}
