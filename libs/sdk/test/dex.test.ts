import { Well } from '../src/lib/Well';
import { ERC20Token, Token, TokenValue } from '@exchange/sdk-core';
import { getTestUtils } from './TestUtils/provider';
import { QuoteResult, SwapBuilder, WellFunction } from '../src';
import { createDex, createWell } from './TestUtils/setup';
import { Direction } from '../src/lib/swap/SwapStep';

const { ExchangeSDK, utils, account } = getTestUtils();

jest.setTimeout(30000);

let builder: SwapBuilder;
let wells: Well[];

const ETH = ExchangeSDK.tokens.ETH;
const WETH = ExchangeSDK.tokens.WETH;
const PINTO = ExchangeSDK.tokens.PINTO;
const USDC = ExchangeSDK.tokens.USDC;
const DAI = ExchangeSDK.tokens.DAI;

beforeAll(async () => {
  await utils.resetFork();
  wells = await createDex(account);

  builder = ExchangeSDK.swapBuilder;

  for await (const well of wells) {
    await builder.addWell(well);
  }

  await utils.mine();
});

describe.skip('Router', () => {});

describe('Dex Swaps', () => {
  describe('Swap Single', () => {
    executeSwap(WETH, PINTO, Direction.FORWARD);
    executeSwap(WETH, PINTO, Direction.REVERSE);

    executeSwap(PINTO, USDC, Direction.FORWARD);
    executeSwap(PINTO, USDC, Direction.REVERSE);
    executeSwap(PINTO, WETH, Direction.FORWARD);
    executeSwap(PINTO, WETH, Direction.REVERSE);

    executeSwap(ETH, WETH, Direction.FORWARD);
    executeSwap(ETH, WETH, Direction.REVERSE);
  });

  describe('Swap Muli', () => {
    executeSwap(WETH, DAI, Direction.FORWARD);
    executeSwap(WETH, DAI, Direction.REVERSE);

    executeSwap(ETH, DAI, Direction.FORWARD);
    executeSwap(ETH, DAI, Direction.REVERSE);

    executeSwap(ETH, PINTO, Direction.FORWARD);
    executeSwap(ETH, PINTO, Direction.REVERSE);
  });
});

async function executeSwap(token1: Token, token2: Token, direction: Direction) {
  it(`Swap ${token1.symbol} => ${token2.symbol}  ${
    direction === Direction.FORWARD ? 'FORWARD' : 'REVERSED'
  }`, async () => {
    const quoter = builder.buildQuote(token1, token2, account);

    expect(quoter).not.toBeNull();

    let amount: TokenValue;
    let quote: QuoteResult;
    let slippage = 0.5;
    const balanceBefore = await token2.getBalance(account);

    if (direction === Direction.FORWARD) {
      amount = token1.amount(100);
      const { amount: quoteAmount, doSwap, doApproval } = await quoter!.quoteForward(amount, account, slippage);

      if (doApproval) {
        const atx = await doApproval();
        await atx.wait();
      }
      if (token1.symbol !== 'ETH') {
        await utils.setBalance(token1, account, amount);
      }
      const stx = await doSwap({ gasLimit: 1_000_000 });
      await stx.wait();

      const balanceAfter = await token2.getBalance(account);
      expect(balanceAfter.gte(balanceBefore.add(quoteAmount)));
    } else {
      amount = token2.amount(100);
      const { amount: quoteAmount, doSwap, doApproval } = await quoter!.quoteReverse(amount, account, slippage);
      // console.log(`${quoteAmount.toHuman()} ${quoter!.fromToken.symbol} Needed to get ==> ${amount.toHuman()} ${quoter!.toToken.symbol}`);

      if (doApproval) {
        const atx = await doApproval();
        await atx.wait();
      }
      if (token1.symbol !== 'ETH') {
        await utils.setBalance(token1, account, quoteAmount.addSlippage(slippage));
      }
      const stx = await doSwap({ gasLimit: 5_000_000 });
      await stx.wait();

      const balanceAfter = await token2.getBalance(account);
      expect(balanceAfter.gte(balanceBefore.add(quoteAmount)));
    }
  });
}
