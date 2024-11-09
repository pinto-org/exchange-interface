import { BigNumber, ethers } from 'ethers';
import { DiamondSDK } from 'src/lib/DiamondSDK';
import { TokenSiloBalance } from 'src/lib/silo/types';
import { ERC20Token, TokenValue, Token } from '@exchange/sdk-core';
import * as addr from './addresses';
import { logSiloBalance } from './log';

export class BlockchainUtils {
  sdk: DiamondSDK;
  provider: ethers.providers.JsonRpcProvider;

  constructor(sdk: DiamondSDK) {
    this.sdk = sdk;
    this.provider = sdk.provider as ethers.providers.JsonRpcProvider; // fixme
  }

  /**
   * Snapshot the state of the blockchain at the current block
   */
  async snapshot() {
    const id = await this.provider.send('evm_snapshot', []);
    console.log('Created snapshot: ', id);
    return id;
  }

  /**
   * Revert the state of the blockchain to a previous snapshot.
   * Takes a single parameter, which is the snapshot id to revert to
   */
  async revert(id: number) {
    await this.provider.send('evm_revert', [id]);
  }

  /**
   * Send a deposit from the BF Multisig -> `to`
   */
  async sendDeposit(
    to: string,
    from: string = addr.BF_MULTISIG,
    token: ERC20Token = this.sdk.tokens.PINTO
  ): Promise<TokenSiloBalance['deposits'][number]> {
    await this.provider.send('anvil_impersonateAccount', [from]);

    const balance = await this.sdk.silo.getBalance(token, from);
    const crate = balance.deposits[balance.deposits.length - 1];
    const season = crate.stem.toString();
    const amount = crate.amount.toBlockchain();

    logSiloBalance(from, balance);
    console.log(`Transferring ${crate.amount.toHuman()} ${token.symbol} to ${to}...`, {
      season,
      amount
    });

    const txn = await this.sdk.contracts.diamond
      .connect(await this.provider.getSigner(from))
      .transferDeposit(from, to, token.address, season, amount);

    await txn.wait();
    await this.provider.send('anvil_stopImpersonatingAccount', [from]);
    console.log(`Transferred!`);

    return crate;
  }

  /**
   * Send BEAN from the BF Multisig -> `to`.
   */
  async sendBean(
    to: string,
    amount: TokenValue,
    from: string = addr.BF_MULTISIG,
    token: ERC20Token = this.sdk.tokens.PINTO
  ) {
    console.log(`Sending ${amount.toHuman()} PINTO from ${from} -> ${to}...`);

    await this.provider.send('anvil_impersonateAccount', [from]);
    const contract = token.getContract().connect(await this.provider.getSigner(from));
    await contract.transfer(to, amount.toBlockchain()).then((r) => r.wait());
    await this.provider.send('anvil_stopImpersonatingAccount', [from]);

    console.log(`Sent!`);
  }

  async resetFork() {
    await this.sdk.provider.send('anvil_reset', [
      {
        forking: {
          jsonRpcUrl: 'https://eth-mainnet.g.alchemy.com/v2/f6piiDvMBMGRYvCOwLJFMD7cUjIvI1TP'
        }
      }
    ]);
  }

  async mine() {
    await this.sdk.provider.send('evm_mine', []); // Just mines to the next block
  }

  async getCurrentBlockNumber() {
    const { number } = await this.sdk.provider.send('eth_getBlockByNumber', ['latest', false]);
    return BigNumber.from(number).toNumber();
  }

  async impersonate(account: string) {
    await this.provider.send('anvil_impersonateAccount', [account]);
    return () => this.stopImpersonating(account);
  }

  async stopImpersonating(account: string) {
    await this.provider.send('anvil_stopImpersonatingAccount', [account]);
  }

  /**
   * To add more erc20 tokens later, you need the slot number. Get it with this:
   * npx slot20 balanceOf TOKENADDRESS RANDOM_HOLDER_ADDRESS -v
   * npx slot20 balanceOf 0x77700005BEA4DE0A78b956517f099260C2CA9a26 0x735cab9b02fd153174763958ffb4e0a971dd7f29 -v --rpc $RPC
   * set reverse to true if mapping format is (slot, key)
   *
   * From this article: https://kndrck.co/posts/local_erc20_bal_mani_w_hh/
   *
   * @param account
   * @param balance
   */
  async setAllBalances(account: string, amount: string, mockToken: boolean = false) {
    await Promise.allSettled([
      // NATIVE
      this.setETHBalance(account, this.sdk.tokens.ETH.amount(amount), mockToken),
      // ERC20
      this.setPINTOBalance(account, this.sdk.tokens.PINTO.amount(amount), mockToken),
      this.setWETHBalance(account, this.sdk.tokens.WETH.amount(amount), mockToken),
      this.setCBETHBalance(account, this.sdk.tokens.CBETH.amount(amount), mockToken),
      this.setCBBTCBalance(account, this.sdk.tokens.CBBTC.amount(amount), mockToken),
      this.setUSDCBalance(account, this.sdk.tokens.USDC.amount(amount), mockToken),
      this.setWSOLBalance(account, this.sdk.tokens.WSOL.amount(amount), mockToken),
      // ERC20 LP
      this.setPINTOWETHBalance(account, this.sdk.tokens.PINTO_ETH_WELL_LP.amount(amount), mockToken),
      this.setPINTOCBETHBalance(account, this.sdk.tokens.PINTO_CBETH_WELL_LP.amount(amount), mockToken),
      this.setPINTOCBBTCBalance(account, this.sdk.tokens.PINTO_CBBTC_WELL_LP.amount(amount), mockToken),
      this.setPINTOUSDCBalance(account, this.sdk.tokens.PINTO_USDC_WELL_LP.amount(amount), mockToken),
      this.setPINTOWSOLBalance(account, this.sdk.tokens.PINTO_WSOL_WELL_LP.amount(amount), mockToken)
    ]);
  }
  async setETHBalance(account: string, balance: TokenValue, _mockToken: boolean = false) {
    return this.sdk.provider.send('hardhat_setBalance', [account, balance.toHex()]);
  }
  async setPINTOBalance(account: string, balance: TokenValue, mockToken: boolean = false) {
    return this.setBalance(this.sdk.tokens.PINTO, account, balance, mockToken);
  }
  async setWETHBalance(account: string, balance: TokenValue, mockToken: boolean = false) {
    return this.setBalance(this.sdk.tokens.WETH, account, balance, mockToken);
  }
  async setCBETHBalance(account: string, balance: TokenValue, mockToken: boolean = false) {
    return this.setBalance(this.sdk.tokens.CBETH, account, balance, mockToken);
  }
  async setCBBTCBalance(account: string, balance: TokenValue, mockToken: boolean = false) {
    return this.setBalance(this.sdk.tokens.CBBTC, account, balance, mockToken);
  }
  async setUSDCBalance(account: string, balance: TokenValue, mockToken: boolean = false) {
    return this.setBalance(this.sdk.tokens.USDC, account, balance, mockToken);
  }
  async setWSOLBalance(account: string, balance: TokenValue, mockToken: boolean = false) {
    return this.setBalance(this.sdk.tokens.WSOL, account, balance, mockToken);
  }
  async setPINTOWETHBalance(account: string, balance: TokenValue, mockToken: boolean = false) {
    return this.setBalance(this.sdk.tokens.PINTO_ETH_WELL_LP, account, balance, mockToken);
  }
  async setPINTOCBETHBalance(account: string, balance: TokenValue, mockToken: boolean = false) {
    return this.setBalance(this.sdk.tokens.PINTO_CBETH_WELL_LP, account, balance, mockToken);
  }
  async setPINTOCBBTCBalance(account: string, balance: TokenValue, mockToken: boolean = false) {
    return this.setBalance(this.sdk.tokens.PINTO_CBBTC_WELL_LP, account, balance, mockToken);
  }
  async setPINTOUSDCBalance(account: string, balance: TokenValue, mockToken: boolean = false) {
    return this.setBalance(this.sdk.tokens.PINTO_USDC_WELL_LP, account, balance, mockToken);
  }
  async setPINTOWSOLBalance(account: string, balance: TokenValue, mockToken: boolean = false) {
    return this.setBalance(this.sdk.tokens.PINTO_WSOL_WELL_LP, account, balance, mockToken);
  }
  

  private getBalanceConfig(tokenAddress: string, mockToken: boolean = false) {
    const slotConfig = new Map<string, [slot: number, isReverse: boolean]>();
    // ERC20
    slotConfig.set(this.sdk.tokens.PINTO.address, [0, false]);
    slotConfig.set(this.sdk.tokens.WETH.address, [mockToken ? 0 : 3, false]); // MOCK
    slotConfig.set(this.sdk.tokens.CBETH.address, [mockToken ? 0 : 51, false]); // MOCK
    slotConfig.set(this.sdk.tokens.CBBTC.address, [mockToken ? 0 : 9, false]); // MOCK
    slotConfig.set(this.sdk.tokens.USDC.address, [mockToken ? 0 : 9, false]); // MOCK
    slotConfig.set(this.sdk.tokens.WSOL.address, [mockToken ? 0 : 5, false]); // MOCK
    // ERC20 LP
    slotConfig.set(this.sdk.tokens.PINTO_ETH_WELL_LP.address, [51, false]);
    slotConfig.set(this.sdk.tokens.PINTO_CBBTC_WELL_LP.address, [51, false]);
    slotConfig.set(this.sdk.tokens.PINTO_CBETH_WELL_LP.address, [51, false]);
    slotConfig.set(this.sdk.tokens.PINTO_USDC_WELL_LP.address, [51, false]);
    slotConfig.set(this.sdk.tokens.PINTO_WSOL_WELL_LP.address, [51, false]);
    return slotConfig.get(tokenAddress);
  }

  /**
   * Writes the new bean & 3crv balances to the evm storage
   */
  async setBalance(token: Token | string, account: string, balance: TokenValue | number, mockToken: boolean) {
    const _token = token instanceof Token ? token : this.sdk.tokens.findByAddress(token);
    if (!_token) {
      throw new Error('token not found');
    }
    const _balance = typeof balance === 'number' ? _token.amount(balance) : balance;
    const balanceAmount = _balance.toBigNumber();

    if (_token.symbol === 'ETH') {
      return this.sdk.provider.send('hardhat_setBalance', [account, balanceAmount.toHexString()]);
    }

    const config = this.getBalanceConfig(_token.address, mockToken);
    if (!config) {
      throw new Error('balance config not found');
    }

    const [slot, isTokenReverse] = config;
    const values = [account, slot];

    if (isTokenReverse) values.reverse();

    const index = ethers.utils.solidityKeccak256(['uint256', 'uint256'], values);
    await this.setStorageAt(_token.address, index.toString(), this.toBytes32(balanceAmount).toString());
  }

  private async setStorageAt(address: string, index: string, value: string) {
    await this.sdk.provider.send('hardhat_setStorageAt', [address, index, value]);
  }

  private toBytes32(bn: ethers.BigNumber) {
    return ethers.utils.hexlify(ethers.utils.zeroPad(bn.toHexString(), 32));
  }

  ethersError(e: any) {
    return `${(e as any).error?.reason || (e as any).toString()}`;
  }

  async sunriseForward() {
    // Calculate how many seconds till next hour
    const block = await this.sdk.provider.send('eth_getBlockByNumber', ['latest', false]);
    const blockTs = parseInt(block.timestamp, 16);
    const blockDate = new Date(blockTs * 1000);
    const secondsTillNextHour = (3600000 - (blockDate.getTime() % 3600000)) / 1000;

    // fast forward evm, to just past the hour and mine a new block
    await this.sdk.provider.send('evm_increaseTime', [secondsTillNextHour + 5]);
    await this.sdk.provider.send('evm_mine', []);

    // call sunrise
    const res = await this.sdk.contracts.diamond.sunrise();
    await res.wait();

    // get the new season
    const season = await this.sdk.contracts.diamond.season();

    return season;
  }

  async forceBlock() {
    await this.sdk.provider.send('evm_increaseTime', [12]);
    await this.sdk.provider.send('evm_mine', []);
  }
}
