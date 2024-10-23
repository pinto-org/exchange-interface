import { Token, TokenValue } from '@exchange/sdk-core';
import { DiamondSDK } from './DiamondSDK';

export class Pinto {
  static sdk: DiamondSDK;

  constructor(sdk: DiamondSDK) {
    Pinto.sdk = sdk;
  }

  /**
   * Returns the current PINTO price
   */
  async getPrice() {
    const [price, totalSupply, deltaB] = await Pinto.sdk.contracts.price.price();

    return TokenValue.fromBlockchain(price, 6);
  }

  /**
   * Returns the deltaB
   */
  async getDeltaB() {
    const [price, totalSupply, deltaB] = await Pinto.sdk.contracts.price.price();

    return TokenValue.fromBlockchain(deltaB, 6);
  }

  /**
   * Returns the "Bean Denominated Value" of the specified token amount
   * @param token
   * @param amount
   * @returns TokenValue of BDV, with 6 decimals
   * @todo cache these results?
   */
  async getPDV(token: Token, amount: TokenValue): Promise<TokenValue> {
    const pdv = await Pinto.sdk.contracts.diamond.bdv(token.address, amount.toBigNumber());

    // We treat PDV as a TokenValue with 6 decimals, like PINTO
    return TokenValue.fromBlockchain(pdv, 6);
  }
}
