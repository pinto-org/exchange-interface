import { DiamondSDK } from 'src/lib/DiamondSDK';
import { TokenValue, Token, ERC20Token, NativeToken } from '@exchange/sdk-core';
import { Quoter } from './Quoter';
import { SwapBuilder } from './SwapBuilder';
import { FarmFromMode, FarmToMode } from '../farm';
import { CallOverrides } from 'ethers';
import { SwapNode } from './nodes';

export class Swap {
  static sdk: DiamondSDK;

  readonly quoter: Quoter;

  constructor(sdk: DiamondSDK) {
    Swap.sdk = sdk;
    this.quoter = new Quoter(Swap.sdk);
    SwapOperation.sdk = sdk;
  }

  buildSwap(
    inputToken: ERC20Token | NativeToken,
    targetToken: ERC20Token | NativeToken,
    recipient: string,
    caller: string,
    fromMode?: FarmFromMode,
    toMode?: FarmToMode
  ) {
    return new SwapOperation(Swap.sdk, this.quoter, inputToken, targetToken, recipient, caller, fromMode, toMode);
  }
}

export interface SwapNodeQuote {
  sellToken: ERC20Token | NativeToken;
  buyToken: ERC20Token | NativeToken;
  sellAmount: TokenValue;
  buyAmount: TokenValue;
  minBuyAmount: TokenValue;
  nodes: ReadonlyArray<SwapNode>;
  slippage: number;
}

export class SwapOperation {
  static sdk: DiamondSDK;

  #quoter: Quoter;

  #builder: SwapBuilder;

  #quoteData: SwapNodeQuote | undefined = undefined;

  readonly inputToken: ERC20Token | NativeToken;

  readonly targetToken: ERC20Token | NativeToken;

  readonly caller: string; // Where the swap is starting. (e.g., Wallet, Pipeline, etc.)

  readonly recipient: string; // Where the swap is going

  fromMode: FarmFromMode;

  toMode: FarmToMode;

  constructor(
    sdk: DiamondSDK,
    quoter: Quoter,
    inputToken: ERC20Token | NativeToken,
    targetToken: ERC20Token | NativeToken,
    recipient: string,
    caller: string,
    fromMode?: FarmFromMode,
    toMode?: FarmToMode
  ) {
    SwapOperation.sdk = sdk;
    this.#quoter = quoter;
    this.#builder = new SwapBuilder(SwapOperation.sdk);

    this.inputToken = inputToken;
    this.targetToken = targetToken;
    this.recipient = recipient;
    this.caller = caller;
    this.fromMode = fromMode ?? FarmFromMode.EXTERNAL;
    this.toMode = toMode ?? FarmToMode.EXTERNAL;
  }

  updateModes(args: { fromMode?: FarmFromMode; toMode?: FarmToMode }) {
    if (args.fromMode) this.fromMode = args.fromMode;
    if (args.toMode) this.toMode = args.toMode;
    this.#buildQuoteData();
  }

  getPath(): Token[] {
    return this.#builder.nodes.map((node, i) => (i === 0 ? [node.sellToken, node.buyToken] : [node.buyToken])).flat();
  }

  getFarm() {
    return this.#builder.advancedFarm;
  }

  get quote() {
    return this.#quoteData;
  }

  /**
   * Refreshes the reserves and prices for all wells and their underlying tokens if the last refresh was more than 15 minutes ago.
   * @param force - If true, the reserves and prices will be refreshed regardless of the time since the last refresh.
   */
  async refresh(force?: boolean) {
    await this.#quoter.refresh(force);
  }

  /**
   * Estimates the swap based on the amount and slippage
   * @param amount
   * @param slippage
   * @param force
   * @returns
   */
  async estimateSwap(amount: TokenValue, slippage: number, force?: boolean) {
    if (amount.lte(0)) return;

    if (this.#shouldFetchQuote(amount, slippage) || force === true) {
      this.#quoteData = await this.#quoter.route(this.inputToken, this.targetToken, amount, slippage);
      this.#buildQuoteData();
      await this.estimate();
    }

    return this.#quoteData;
  }

  /**
   * Runs estimate on the advanced farm workflow
   */
  async estimate() {
    if (!this.#quoteData) {
      throw new Error('Cannot estimate without quote data.');
    }
    return this.#builder.advancedFarm.estimate(this.#quoteData.sellAmount.toBigNumber());
  }

  async estimateGas(): Promise<TokenValue> {
    // run estimate if not already done
    if (!this.#builder.advancedFarm.length) {
      await this.estimate();
    }
    if (!this.#builder.advancedFarm.length || !this.#quoteData) {
      throw new Error('Invalid swap configuration. Cannot estimate gas.');
    }
    const gas = await this.#builder.advancedFarm.estimateGas(this.#quoteData.sellAmount.toBigNumber(), {
      slippage: this.#quoteData.slippage
    });
    return TokenValue.fromBlockchain(gas, 0);
  }

  async execute(overrides: CallOverrides = {}) {
    if (!this.#builder.advancedFarm.length) {
      await this.estimate();
    }
    if (!this.#builder.advancedFarm.length || !this.#quoteData) {
      throw new Error('Invalid swap configuration. Run estimate first.');
    }
    return this.#builder.advancedFarm.execute(
      this.#quoteData.sellAmount,
      { slippage: this.#quoteData.slippage },
      overrides
    );
  }

  #buildQuoteData() {
    if (!this.#quoteData) return;
    this.#builder.translateNodesToWorkflow(
      this.#quoteData.nodes,
      this.fromMode,
      this.toMode,
      this.caller,
      this.recipient
    );
  }

  #shouldFetchQuote(amount: TokenValue, slippage: number) {
    if (this.#quoteData) {
      const { sellAmount, slippage: slip } = this.#quoteData;
      return !sellAmount.eq(amount) || slip !== slippage;
    }
    return true;
  }

  /**
   * Build a swap operation w/ quote data via Beanswap.quoter.
   * @param quoteData
   * @param caller
   * @param recipient
   * @param fromMode
   * @param toMode
   * @returns
   */
  static buildWithQuote(
    quoteData: SwapNodeQuote,
    caller: string,
    recipient: string,
    fromMode: FarmFromMode,
    toMode: FarmToMode
  ) {
    const swap = new SwapOperation(
      Swap.sdk,
      Swap.sdk.swap.quoter,
      quoteData.sellToken,
      quoteData.buyToken,
      caller,
      recipient,
      fromMode,
      toMode
    );
    swap.#quoteData = quoteData;
    swap.#buildQuoteData();
    return swap;
  }
}
