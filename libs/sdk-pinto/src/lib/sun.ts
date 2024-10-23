import { ContractTransaction } from 'ethers';
import { PintoSDK } from './PintoSDK';

export class Sun {
  static sdk: PintoSDK;

  constructor(sdk: PintoSDK) {
    Sun.sdk = sdk;
  }

  async getSeason(): Promise<number> {
    return Sun.sdk.contracts.diamond.season();
  }
}
