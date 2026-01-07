import type { DiamondSDK } from './DiamondSDK';
import {
  Pipeline,
  Pipeline__factory,
  Depot__factory,
  Depot,
  UnwrapAndSendEthJunction,
  UnwrapAndSendEthJunction__factory,
  Junction,
  Junction__factory,
  Diamond,
  DiamondPrice,
  Diamond__factory,
  DiamondPrice__factory
} from 'src/constants/generated';

type PipelineJunctions = {
  unwrapAndSendEth: UnwrapAndSendEthJunction;
};

export class Contracts {
  static sdk: DiamondSDK;

  public readonly diamond: Diamond;
  public readonly diamondRead: Diamond;
  public readonly price: DiamondPrice;

  public readonly pipeline: Pipeline;
  public readonly depot: Depot;
  public readonly junction: Junction;
  public readonly pipelineJunctions: PipelineJunctions;

  constructor(sdk: DiamondSDK) {
    Contracts.sdk = sdk;

    // ---------- Addresses ----------
    // Beanstalk
    const diamondAddress = sdk.addresses.PINTO_DIAMOND.get(sdk.chainId);
    const priceAddress = sdk.addresses.PINTO_PRICE.get(sdk.chainId);

    // Ecosystem
    const pipelineAddress = sdk.addresses.PIPELINE.get(sdk.chainId);
    const depotAddress = sdk.addresses.DEPOT.get(sdk.chainId);
    const junctionAddress = sdk.addresses.JUNCTION.get(sdk.chainId);
    const unwrapAndSendEthAddress = sdk.addresses.UNWRAP_AND_SEND_ETH.get(sdk.chainId);

    // ---------- Instances ----------
    // Beanstalk
    this.diamond = Diamond__factory.connect(diamondAddress, sdk.providerOrSigner);
    this.price = DiamondPrice__factory.connect(priceAddress, sdk.providerOrSigner);

    // Ecosystem
    this.pipeline = Pipeline__factory.connect(pipelineAddress, sdk.providerOrSigner);
    this.depot = Depot__factory.connect(depotAddress, sdk.providerOrSigner);
    this.junction = Junction__factory.connect(junctionAddress, sdk.providerOrSigner);
    this.pipelineJunctions = {
      unwrapAndSendEth: UnwrapAndSendEthJunction__factory.connect(unwrapAndSendEthAddress, sdk.providerOrSigner)
    };
  }
}
