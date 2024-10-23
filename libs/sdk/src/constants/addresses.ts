import { Address, ChainId } from '@exchange/sdk-core';
import { DiamondSDK } from '@exchange/sdk-diamond';

export const addresses = {
  /////////////// Diamond SDK ///////////////
  ...DiamondSDK.addresses,

  /////////////// Well Components ///////////////
  AQUIFER: Address.make({
    [ChainId.BASE_MAINNET]: '0xBA51AAAb262240Dc643DbAEe69D1C6cE4a782Fc4'
  }),

  // Pumps
  MULTI_FLOW_PUMP: Address.make({
    [ChainId.BASE_MAINNET]: '0xBA51AAA26459a4262C9fb32D12BE4590370D1D76'
  }),

  // Well Functions
  CONSTANT_PRODUCT_2: Address.make({
    [ChainId.BASE_MAINNET]: '0xBA51CCDA01949F05eAd85435DbD78725262Ceaa2'
  }),
  STABLE2: Address.make({
    [ChainId.BASE_MAINNET]: '0xBA51AA139613Ca485F5e139FE049B5B590211e7E'
  }),

  // Well Implementations
  /** Upgradeable well implementation */
  WELL_UPGRADEABLE: Address.make({
    [ChainId.BASE_MAINNET]: '0xBA51099EB68de5Ff86F6594e1B4052382946aefF'
  }),
  /** Immutable well implementation */
  WELL_DOT_SOL: Address.make({
    [ChainId.BASE_MAINNET]: '0xBA510deDc07BAb13e6f8BEF3044D737D325c9Ce2'
  }),

  STABLE2_LOOKUP: Address.make({
    [ChainId.BASE_MAINNET]: '0xBA51055ee933ac6aB80Ad377e00a97226ED17223'
  }),

  /////////////// WETH9 ///////////////
  WETH9: Address.make({
    [ChainId.BASE_MAINNET]: '0x4200000000000000000000000000000000000006'
  })
};
