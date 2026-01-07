import { BigNumber } from 'ethers';

import { DiamondSDK } from './DiamondSDK';
import * as utils from './silo/utils';

import { Token, TokenValue } from '@exchange/sdk-core';
import { TokenSiloBalance } from './silo/types';

export class Silo {
  static sdk: DiamondSDK;

  // 1 Seed grows 1 / 10_000 Stalk per Season.
  // 1/10_000 = 1E-4
  // BS3TODO: FIXME.
  static STALK_PER_SEED_PER_SEASON = TokenValue.fromHuman(1e-4, 10);

  constructor(sdk: DiamondSDK) {
    Silo.sdk = sdk;
  }

  /**
   *
   * Return the Farmer's balance of a single whitelisted token.
   */
  public async getBalance(_token: Token, _account?: string): Promise<TokenSiloBalance> {
    const [account, stemTip, germinatingStem] = await Promise.all([
      Silo.sdk.getAccount(_account),
      this.getStemTip(_token),
      Silo.sdk.contracts.diamond.getGerminatingStem(_token.address)
    ]);

    if (!Silo.sdk.tokens.whitelist.has(_token)) {
      throw new Error(`${_token.address} is not whitelisted in the Silo`);
    }

    /// SETUP
    const balance: TokenSiloBalance = utils.makeTokenSiloBalance();
    const farmerDeposits = await Silo.sdk.contracts.diamond.getTokenDepositsForAccount(account, _token.address);
    const depositsByToken = utils.parseDepositsByToken(Silo.sdk, [farmerDeposits]);

    // The processor's return schema assumes we might have wanted to grab
    // multiple tokens, so we have to grab the one we want
    const deposits = depositsByToken.get(_token);

    for (let stem in deposits) {
      utils.applyDeposit(balance, _token, {
        stem,
        id: deposits[stem].id,
        amount: deposits[stem].amount
      });
    }

    utils.sortCrates(balance);
    return balance;
  }

  /**
   * Return a Farmer's Silo balances.
   *
   * ```
   * [Token] => {
   *   amount,
   *   bdv,
   *   deposits
   * }
   * ```
   */
  public async getBalances(_account?: string): Promise<Map<Token, TokenSiloBalance>> {
    /// SETUP
    const whitelist = Silo.sdk.tokens.whitelist;
    const whiteListTokens = Array.from(whitelist);
    const balances = new Map<Token, TokenSiloBalance>();
    whitelist.forEach((token) => balances.set(token, utils.makeTokenSiloBalance()));

    const [account, stemTips, germinatingStemsRaw] = await Promise.all([
      Silo.sdk.getAccount(_account),
      this.getStemTips(),
      Silo.sdk.contracts.diamond.getGerminatingStems(whiteListTokens.map((t) => t.address))
    ]);

    // Set germinatingStems
    const germinatingStems = new Map<Token, BigNumber>();
    for (let i = 0; i < germinatingStemsRaw.length; i++) {
      germinatingStems.set(whiteListTokens[i], germinatingStemsRaw[i]);
    }

    /// LEDGER
    const farmerDeposits = await Silo.sdk.contracts.diamond.getDepositsForAccount(account);
    const depositsByToken = utils.parseDepositsByToken(Silo.sdk, farmerDeposits);

    // Handle deposits.
    // Attach stalk & seed counts for each crate.
    depositsByToken.forEach((deposits, token) => {
      const germinatingStem = germinatingStems.get(token)!;
      if (!germinatingStem) throw new Error(`No germinatingStem found for ${token.symbol}`);

      // If we receive a token that wasn't on the SDK's known whitelist, create
      // a new balance object for it. (This shouldn't happen)
      if (!balances.has(token)) balances.set(token, utils.makeTokenSiloBalance());
      const balance = balances.get(token)!;

      // Load stem tip, used to calculate the amount of grown stalk
      const stemTip = stemTips.get(token.address);
      if (!stemTip) throw new Error(`No stem tip found for ${token.address}`);

      for (let stem in deposits) {
        // Filter dust crates - should help with crate balance too low errors
        if (deposits[stem].amount.toString() !== '1') {
          utils.applyDeposit(balance, token, {
            stem,
            id: deposits[stem].id,
            amount: deposits[stem].amount
          });
        }
      }

      utils.sortCrates(balance);
    });

    // FIXME: sorting is redundant if this is instantiated
    return utils.sortTokenMapByWhitelist(Silo.sdk.tokens.whitelist, balances);
  }

  /**
   * TODO: Cache stemStartSeason and calculate tip using Season?
   */
  async getStemTip(token: Token): Promise<BigNumber> {
    return Silo.sdk.contracts.diamond.stemTipForToken(token.address);
  }

  /**
   * TODO: Cache stemStartSeason and calculate tip using Season?
   */
  async getStemTips() {
    const [wlTokens, stemTips] = await Promise.all([
      Silo.sdk.contracts.diamond.getWhitelistedTokens(),
      Silo.sdk.contracts.diamond.getStemTips()
    ]);

    return new Map<string, BigNumber>(
      wlTokens.map((tokenAddress, i) => [tokenAddress.toLowerCase(), stemTips[i]] as const)
    );
  }
}
