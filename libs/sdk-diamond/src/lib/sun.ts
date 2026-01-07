import { ContractTransaction } from 'ethers';
import { DiamondSDK } from './DiamondSDK';

export class Sun {
  static sdk: DiamondSDK;

  constructor(sdk: DiamondSDK) {
    Sun.sdk = sdk;
  }

  async getSeason(): Promise<number> {
    return Sun.sdk.contracts.diamond.season();
  }
}
