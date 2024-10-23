import { Token } from '@exchange/sdk-core';
import { Router } from '../routing';
import { Well } from '../Well';
import { Quote } from './Quote';
import { ExchangeSDK } from '../ExchangeSDK';

export class SwapBuilder {
  private readonly sdk: ExchangeSDK;
  router: Router;

  constructor(sdk: ExchangeSDK) {
    this.sdk = sdk;
    this.router = new Router(sdk);
  }

  async addWell(well: Well) {
    await this.router.addWell(well);
  }

  buildQuote(fromToken: Token, toToken: Token, account: string): Quote | null {
    const route = this.router.getRoute(fromToken, toToken);
    if (route.length < 1) return null;

    return new Quote(this.sdk, fromToken, toToken, route, account);
  }
}
