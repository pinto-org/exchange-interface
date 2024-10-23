import { ethers } from 'ethers';
import { setupConnection } from '../utils/TestUtils/provider';
import { DiamondSDK } from './DiamondSDK';

/// Utilities
const RUN_TIMER = false;
const timer = async (fn: Promise<any>, label: string) => {
  if (RUN_TIMER) console.time(label);
  const r = await fn;
  if (RUN_TIMER) console.timeEnd(label);
  return r;
};

/// Constants
const account1 = '0x9a00beffa3fc064104b71f6b7ea93babdc44d9da'; // whale

/// Setup
let sdk: DiamondSDK;
let account: string;

beforeAll(async () => {
  const { signer, provider, account: _account } = await setupConnection();
  sdk = new DiamondSDK({ provider, signer });
  account = _account;
});
describe('Utilities', function () {
  it('creates a correct TokenBalance struct', () => {
    // @ts-ignore testing private method
    const balance = sdk.tokens.makeTokenBalance(sdk.tokens.BEAN, {
      internalBalance: ethers.BigNumber.from(1000_000000),
      externalBalance: ethers.BigNumber.from(5000_000000),
      totalBalance: ethers.BigNumber.from(6000_000000)
    });
    expect(balance.internal.eq(sdk.tokens.PINTO.amount(1000))).toBe(true);
    expect(balance.external.eq(sdk.tokens.PINTO.amount(5000))).toBe(true);
    expect(balance.total.eq(sdk.tokens.PINTO.amount(6000))).toBe(true);
    expect(balance.internal.toHuman()).toBe('1000');
    expect(balance.external.toHuman()).toBe('5000');
    expect(balance.total.toHuman()).toBe('6000');
  });
});

describe('Function: getBalance', function () {
  it('returns a TokenBalance struct when the token is ETH', async () => {
    const balance = await sdk.tokens.getBalance(sdk.tokens.ETH, sdk.tokens.WETH.address);
    expect(balance.internal.eq(0)).toBe(true);
    expect(balance.external.gt(0)).toBe(true);
    expect(balance.external.toBlockchain()).toBe(balance.total.toBlockchain());
  });
});

describe('Function: getBalances', function () {
  // it('throws without account or signer', async () => {
  //   await expect(sdk.tokens.getBalances()).rejects.toThrow();
  // });
  it('throws if a provided address is not a valid address', async () => {
    await expect(sdk.tokens.getBalances(account1, ['foo'])).rejects.toThrow();
  });
  it('throws if a provided address is not a token', async () => {
    // beanstalk.getAllBalances will revert if any of the requested tokens aren't actually tokens
    await expect(sdk.tokens.getBalances(account1, [account1])).rejects.toThrow('call revert exception');
  });
  it('accepts string for _tokens', async () => {
    const PINTO = sdk.tokens.PINTO.address;
    const result = await sdk.tokens.getBalances(account1, [PINTO]);
    expect(result.has(sdk.tokens.PINTO)).toBe(true);
  });
  it('accepts Token instance for _tokens', async () => {
    const result = await sdk.tokens.getBalances(account1, [sdk.tokens.PINTO]);
    expect(result.has(sdk.tokens.PINTO)).toBe(true);
  });
  it('returns a balance struct for each provided token', async () => {
    const result = await sdk.tokens.getBalances(account1, [
      sdk.tokens.PINTO,
      sdk.tokens.USDC,
      sdk.tokens.CBBTC,
      sdk.tokens.CBETH
    ]);
    expect(result.has(sdk.tokens.PINTO)).toBe(true);
    expect(result.has(sdk.tokens.CBBTC)).toBe(false);
    expect(result.has(sdk.tokens.USDC)).toBe(true);
    expect(result.has(sdk.tokens.CBBTC)).toBe(true);
    expect(result.has(sdk.tokens.CBETH)).toBe(true);
  });
});
