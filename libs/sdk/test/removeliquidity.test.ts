import { Well } from '../src/lib/Well';
import { ERC20Token, Token, TokenValue } from '@exchange/sdk-core';
import { getTestUtils } from './TestUtils/provider';
import { Aquifer, WellFunction } from '../src';

const { ExchangeSDK, utils, account } = getTestUtils();

jest.setTimeout(30000);

let testWell: Well;
let wellLpToken: Token;

beforeAll(async () => {
  await utils.resetFork();
});

const setupWell = async (wellTokens: ERC20Token[], account: string) => {
  // Deploy test well
  const testAquifer = await Aquifer.BuildAquifer(ExchangeSDK);
  const wellFunction = await WellFunction.BuildConstantProduct(ExchangeSDK);
  const testWell = await Well.DeployViaAquifer(ExchangeSDK, testAquifer, wellTokens, wellFunction, []);

  // Set initial balances for all well tokens
  await Promise.all(
    wellTokens.map(async (token) => {
      await utils.setBalance(token, account, token.amount(100000000));
    })
  );

  await utils.mine();

  // approve all tokens
  for await (const token of wellTokens) {
    await token.approve(testWell.address, TokenValue.MAX_UINT256.toBigNumber());
  }

  // Add liquidity to the well
  const liquidityAmounts = wellTokens.map((token) => token.amount(10000000));
  const quote = await testWell.addLiquidityQuote(liquidityAmounts);
  await testWell.addLiquidity(liquidityAmounts, quote, account);

  const wellLpTokenBalance = await (await testWell.getLPToken()).getBalance(account);
  expect(wellLpTokenBalance.gt(TokenValue.ZERO)).toBeTruthy();

  return testWell;
};

describe('Remove Liquidity', () => {
  beforeEach(async () => {
    testWell = await setupWell([ExchangeSDK.tokens.PINTO, ExchangeSDK.tokens.WETH], account);
    wellLpToken = await testWell.getLPToken();
  });

  describe('removeLiquidity', function () {
    it('should remove liquidity in a balanced ratio', async function () {
      const initialLpBalance = await wellLpToken.getBalance(account);
      const initialPINTOBalance = await ExchangeSDK.tokens.PINTO.getBalance(account);
      const initialWethBalance = await ExchangeSDK.tokens.WETH.getBalance(account);
      const lpAmountIn = wellLpToken.amount(5);

      // Get the expected token amounts
      const quote = await testWell.removeLiquidityQuote(lpAmountIn);

      // Remove liquidity
      const tx = await testWell.removeLiquidity(lpAmountIn, quote, account);
      expect(tx).toBeDefined();

      // Check the LP token balance
      const finalLpBalance = await wellLpToken.getBalance(account);
      expect(finalLpBalance.lt(initialLpBalance)).toBeTruthy();

      // Check the token balances to make sure they reflect the expected amounts of removed liquidity
      const expectedPINTOBalanceAfterRemove = initialPINTOBalance.add(quote[0]);
      const actualPINTOBalanceAfterRemove = await ExchangeSDK.tokens.PINTO.getBalance(account);
      expect(actualPINTOBalanceAfterRemove.eq(expectedPINTOBalanceAfterRemove)).toBeTruthy();

      const expectedWethBalanceAfterRemove = initialWethBalance.add(quote[1]);
      const actualWethBalanceAfterRemove = await ExchangeSDK.tokens.WETH.getBalance(account);
      expect(actualWethBalanceAfterRemove.eq(expectedWethBalanceAfterRemove)).toBeTruthy();
    });
  });

  describe('removeLiquidityOneToken', function () {
    it('should remove liquidity in a single token', async function () {
      const initialLpBalance = await wellLpToken.getBalance(account);
      const initialPINTOBalance = await ExchangeSDK.tokens.PINTO.getBalance(account);
      const lpAmountIn = wellLpToken.amount(5);

      // Get the expended token amounts
      const quote = await testWell.removeLiquidityOneTokenQuote(lpAmountIn, ExchangeSDK.tokens.PINTO);

      // Remove liquidity
      const tx = await testWell.removeLiquidityOneToken(lpAmountIn, ExchangeSDK.tokens.PINTO, quote, account);

      // Check the LP token balance
      const finalLpBalance = await wellLpToken.getBalance(account);
      expect(finalLpBalance.lt(initialLpBalance)).toBeTruthy();

      // Check the token balances to make sure they reflect the expected amounts of removed liquidity
      const expectedPINTOBalanceAfterRemove = initialPINTOBalance.add(quote);
      const actualPINTOBalanceAfterRemove = await ExchangeSDK.tokens.PINTO.getBalance(account);
      expect(actualPINTOBalanceAfterRemove.eq(expectedPINTOBalanceAfterRemove)).toBeTruthy();
    });
  });

  describe('removeLiquidityImbalanced', function () {
    it('should remove liquidity in an imbalanced ratio', async function () {
      const initialLpBalance = await wellLpToken.getBalance(account);
      const initialPINTOBalance = await ExchangeSDK.tokens.PINTO.getBalance(account);
      const initialWethBalance = await ExchangeSDK.tokens.WETH.getBalance(account);

      // Get the expended token amounts
      const PINTOAmount: TokenValue = ExchangeSDK.tokens.PINTO.amount(1000);
      const wethAmount: TokenValue = ExchangeSDK.tokens.WETH.amount(10);
      const quote = await testWell.removeLiquidityImbalancedQuote([PINTOAmount, wethAmount]);

      // Remove liquidity
      const tx = await testWell.removeLiquidityImbalanced(quote, [PINTOAmount, wethAmount], account);

      // Check the LP token balance
      const finalLpBalance = await wellLpToken.getBalance(account);
      expect(finalLpBalance.lt(initialLpBalance)).toBeTruthy();

      // Check the token balances to make sure they reflect the expected amounts of removed liquidity
      const expectedPINTOBalanceAfterRemove = initialPINTOBalance.add(PINTOAmount);
      const actualPINTOBalanceAfterRemove = await ExchangeSDK.tokens.PINTO.getBalance(account);
      expect(actualPINTOBalanceAfterRemove.eq(expectedPINTOBalanceAfterRemove)).toBeTruthy();

      const expectedWethBalanceAfterRemove = initialWethBalance.add(wethAmount);
      const actualWethBalanceAfterRemove = await ExchangeSDK.tokens.WETH.getBalance(account);
      expect(actualWethBalanceAfterRemove.eq(expectedWethBalanceAfterRemove)).toBeTruthy();
    });
  });
});
