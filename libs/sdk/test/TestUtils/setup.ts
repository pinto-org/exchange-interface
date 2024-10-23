import { ERC20Token, TokenValue } from '@exchange/sdk-core';
import { Well } from '../../src/lib/Well';
import { getTestUtils } from './provider';
import { Aquifer } from '../../src/lib/Aquifer';
import { WellFunction } from '../../src/lib/WellFunction';

const { ExchangeSDK, utils, account } = getTestUtils();

export const createWell = async (
  wellTokens: ERC20Token[],
  account: string,
  aquifer?: Aquifer,
  liquidityAmounts?: TokenValue[]
) => {
  if (!aquifer) aquifer = await Aquifer.BuildAquifer(ExchangeSDK);
  if (!liquidityAmounts) liquidityAmounts = wellTokens.map((token) => token.amount(50_000_000));

  const wellFunction = await WellFunction.BuildConstantProduct(ExchangeSDK);
  const well = await Well.DeployViaAquifer(ExchangeSDK, aquifer, wellTokens, wellFunction, []);

  // Set initial balances for all well tokens
  await Promise.all(
    wellTokens.map(async (token, i) => {
      await utils.setBalance(token, account, liquidityAmounts![i]);
    })
  );

  await utils.mine();

  for await (const token of wellTokens) {
    await token.approve(well.address, TokenValue.MAX_UINT256.toBigNumber());
  }

  // Add liquidity to the well

  const quote = await well.addLiquidityQuote(liquidityAmounts);
  await well.addLiquidity(liquidityAmounts, quote, account);

  return well;
};

export const createDex = async (account: string) => {
  const ETH = ExchangeSDK.tokens.ETH;
  const PINTO = ExchangeSDK.tokens.PINTO;
  const WETH = ExchangeSDK.tokens.WETH;
  const USDC = ExchangeSDK.tokens.USDC;
  const DAI = ExchangeSDK.tokens.DAI;
  await utils.setBalance(ETH, account, ETH.amount(50_000));
  const aquifer = await Aquifer.BuildAquifer(ExchangeSDK);
  console.log('Aquifer: ' + aquifer.address);

  const WETH_PINTO = await createWell([WETH, PINTO], account, aquifer, [WETH.amount(25_000), PINTO.amount(50_000_000)]);
  const PINTO_USDC = await createWell([PINTO, USDC], account, aquifer);
  const USDC_DAI = await createWell([USDC, DAI], account, aquifer);

  return [WETH_PINTO, PINTO_USDC, USDC_DAI];
};
