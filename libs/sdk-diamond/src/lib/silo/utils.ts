import { DiamondSDK } from 'src/lib/DiamondSDK';
import { ethers } from 'ethers';
import { TokenValue, Token } from '@exchange/sdk-core';
import { TokenSiloBalance, Deposit } from './types';
import { SiloGettersFacet } from 'src/constants/generated/Diamond';

export function sortCrates(state: TokenSiloBalance) {
  state.deposits = state.deposits.sort(
    (a, b) => a.stem.sub(b.stem).toNumber() // sort by season asc
  );
}

/**
 * Sort the incoming map so that tokens are ordered in the same order
 * they appear on the Silo Whitelist.
 *
 * @note the Silo Whitelist is sorted by the order in which tokens were
 * whitelisted in Beanstalk. Unclear if the ordering shown on the
 * Beanstalk UI will change at some point in the future.
 */
export function sortTokenMapByWhitelist<T extends any>(whitelist: Set<Token>, map: Map<Token, T>) {
  const copy = new Map<Token, T>(map);
  const ordered = new Map<Token, T>();
  // by default, order by whitelist
  whitelist.forEach((token) => {
    const v = copy.get(token);
    if (v) {
      ordered.set(token, v);
      copy.delete(token);
    }
  });
  // add remaining tokens
  copy.forEach((_, token) => {
    ordered.set(token, copy.get(token)!);
  });
  return ordered;
}

export function makeTokenSiloBalance(): TokenSiloBalance {
  return {
    amount: TokenValue.ZERO,
    convertibleAmount: TokenValue.ZERO,
    deposits: [] as Deposit[]
  };
}

export function packAddressAndStem(address: string, stem: ethers.BigNumber): ethers.BigNumber {
  const addressBN = ethers.BigNumber.from(address);
  const shiftedAddress = addressBN.shl(96);
  const stemUint = stem.toTwos(96);
  return shiftedAddress.or(stemUint);
}

export function unpackAddressAndStem(data: ethers.BigNumber): {
  tokenAddress: string;
  stem: ethers.BigNumber;
} {
  const tokenAddressBN = data.shr(96);
  const tokenAddress = ethers.utils.getAddress(tokenAddressBN.toHexString());
  const stem = data.mask(96).fromTwos(96);
  return { tokenAddress, stem };
}

type TokenDepositsByStem = {
  [stem: string]: {
    id: ethers.BigNumber;
    amount: ethers.BigNumber;
    pdv: ethers.BigNumber;
  };
};

export function parseDepositsByToken(sdk: DiamondSDK, data: SiloGettersFacet.TokenDepositIdStructOutput[]) {
  const depositsByToken: Map<Token, TokenDepositsByStem> = new Map();
  data.forEach(({ token: tokenAddr, depositIds, tokenDeposits }) => {
    const token = sdk.tokens.findByAddress(tokenAddr);
    if (!token) return;

    const depositsByStem = depositIds.reduce<TokenDepositsByStem>((memo, depositId, index) => {
      const { stem } = unpackAddressAndStem(depositId);
      const deposit = tokenDeposits[index];

      memo[stem.toString()] = {
        id: depositId,
        amount: deposit.amount,
        pdv: deposit.bdv
      };

      return memo;
    }, {});

    depositsByToken.set(token, depositsByStem);
  });

  return depositsByToken;
}

export type RawDepositData = {
  id: ethers.BigNumber;
  stem: ethers.BigNumberish;
  amount: ethers.BigNumberish;
};

/**
 * Create a new Deposit object.
 *
 * @param token Token contained within the crate
 * @param stemTipForToken The current stem tip for this token, for calculation of grownStalk.
 * @param data.stem The stem (identifier) of this Deposit
 * @param data.amount The amount of deposit
 * @param data.bdv The bdv of deposit
 * @returns DepositCrate<TokenValue>
 */
export function makeDepositObject(token: Token, data: RawDepositData): Deposit {
  // On-chain
  const stem = ethers.BigNumber.from(data.stem);
  const amount = token.fromBlockchain(data.amount.toString());

  return {
    id: data.id,
    stem,
    amount
  };
}

/**
 * Apply a Deposit to a TokenSiloBalance.
 */
export function applyDeposit(balance: TokenSiloBalance, token: Token, data: RawDepositData) {
  const deposit = makeDepositObject(token, data);

  balance.amount = balance.amount.add(deposit.amount);
  balance.deposits.push(deposit);

  return deposit;
}
