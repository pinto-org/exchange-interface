import { Address, ChainId } from '@exchange/sdk-core';
import { DiamondSDK } from '@exchange/sdk-diamond';

export const addresses = {
  /////////////// Diamond SDK ///////////////
  ...DiamondSDK.addresses,

  /////////////// Well Components ///////////////
  AQUIFER: Address.make({
    [ChainId.BASE_MAINNET]: '0xBA51AAA7738dc08BC8d1F035ee3A2a8088658D1c'
  }),

  // Pumps
  MULTI_FLOW_PUMP: Address.make({
    [ChainId.BASE_MAINNET]: '0xBA51AA8474ff7ED83b6335288547B9271C6e4123'
  }),

  // Well Functions
  CONSTANT_PRODUCT_2: Address.make({
    [ChainId.BASE_MAINNET]: '0xBA510C25b9F67D87Ee2D3246bc77fc49D1aC794B'
  }),
  STABLE2: Address.make({
    [ChainId.BASE_MAINNET]: '0xBA51055c192789a72255C5203Ae0Ffb9b7FBbe15'
  }),

  // Well Implementations
  /** Upgradeable well implementation */
  WELL_UPGRADEABLE: Address.make({
    [ChainId.BASE_MAINNET]: '0xBA510994430b55F7e4B943a22d9bF4cc5aF94A43'
  }),
  /** Immutable well implementation */
  WELL_DOT_SOL: Address.make({
    [ChainId.BASE_MAINNET]: '0xBA5100B4A920c1Bc244d22d36C21766C14dcF550'
  }),

  STABLE2_LOOKUP: Address.make({
    [ChainId.BASE_MAINNET]: '0xBA510A1347f56cBdfB24E3100b5d9aeedF367Cc9'
  }),

  /////////////// WETH9 ///////////////
  WETH9: Address.make({
    [ChainId.BASE_MAINNET]: '0x4200000000000000000000000000000000000006'
  })
};
