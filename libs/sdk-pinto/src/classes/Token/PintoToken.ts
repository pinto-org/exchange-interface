import { Token } from '@exchange/sdk-core';
import { TokenValue } from '@exchange/sdk-core';

export class SystemToken extends Token {
  public getContract() {
    return null;
  }

  public getBalance() {
    return Promise.resolve(TokenValue.NEGATIVE_ONE);
  }

  public getAllowance() {
    return Promise.resolve(TokenValue.MAX_UINT256);
  }

  public hasEnoughAllowance(): boolean {
    return false; // FIXME
  }

  public getTotalSupply() {
    return undefined;
  }
}
