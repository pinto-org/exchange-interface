import { getTestUtils } from "./provider";

const { sdk, account, utils } = getTestUtils();

// For some reason we need to add a tiny delay between writing and reading the
// memory, otherwise these tests randomly fail
const DELAY = 10;

describe("TestUtils", () => {
  beforeAll(async () => {
    await utils.resetFork();
  });
  it('Hack DAI balance', async () => {
    const token = sdk.tokens.CBBTC;
    await utils.setCBBTCBalance(account, token.amount(3));
    await pause(DELAY);
    const bal = await token.getBalance(account);
    expect(bal.toHuman()).toBe('3');
  });
  it('Hack USDC balance', async () => {
    const USDC = sdk.tokens.USDC;
    await utils.setUSDCBalance(account, USDC.amount(30000));
    await pause(DELAY);
    const bal = await USDC.getBalance(account);
    expect(bal.toHuman()).toBe('30000');
  });
  it('Hack USDT balance', async () => {
    const token = sdk.tokens.CBETH;
    await utils.setCBETHBalance(account, token.amount(30));
    await pause(DELAY);
    const bal = await token.getBalance(account);
    expect(bal.toHuman()).toBe('30');
  });
  it("Hack WETH balance", async () => {
    const WETH = sdk.tokens.WETH;
    await utils.setWETHBalance(account, WETH.amount(30000));
    await pause(DELAY);
    const bal = await WETH.getBalance(account);
    expect(bal.toHuman()).toBe("30000");
  });
  it('Hack PINTO balance', async () => {
    const PINTO = sdk.tokens.PINTO;
    await utils.setPINTOBalance(account, PINTO.amount(30000));
    await pause(DELAY);
    const bal = await PINTO.getBalance(account);
    expect(bal.toHuman()).toBe('30000');
  });
});

const pause = (ms: number) => new Promise((res) => setTimeout(res, ms));
