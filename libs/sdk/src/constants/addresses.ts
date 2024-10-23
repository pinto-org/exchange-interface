import { Address, ChainId } from '@exchange/sdk-core';

export const addresses = {
  /////////////// Tokens ///////////////
  PINTO: Address.make({
    [ChainId.BASE_MAINNET]: '0xb170000aeeFa790fa61D6e837d1035906839a3c8'
  }),
  CBBTC: Address.make({
    [ChainId.BASE_MAINNET]: '0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf'
  }),
  WETH: Address.make({
    [ChainId.BASE_MAINNET]: '0x4200000000000000000000000000000000000006'
  }),
  CBETH: Address.make({
    [ChainId.BASE_MAINNET]: '0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22'
  }),
  WEETH: Address.make({
    [ChainId.BASE_MAINNET]: '0x04C0599Ae5A44757c0af6F9eC3b93da8976c150A'
  }),
  WSTETH: Address.make({
    [ChainId.BASE_MAINNET]: '0xc1CBa3fCea344f92D9239c08C0568f6F2F0ee452'
  }),
  RETH: Address.make({
    [ChainId.BASE_MAINNET]: '0xB6fe221Fe9EeF5aBa221c348bA20A1Bf5e73624c'
  }),
  USDC: Address.make({
    [ChainId.BASE_MAINNET]: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'
  }),
  USDT: Address.make({
    [ChainId.BASE_MAINNET]: '0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2'
  }),
  DAI: Address.make({
    [ChainId.BASE_MAINNET]: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb'
  }),
  ZRO: Address.make({
    [ChainId.BASE_MAINNET]: '0x6985884C4392D348587B19cb9eAAf157F13271cd'
  }),

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
  }),

  /////////////// PINTO Ecosystem Contracts ///////////////
  DEPOT: Address.make({
    [ChainId.BASE_MAINNET]: '0xDEb0f00B711f90e503D3035E890A19693ef27Db9'
  }),
  PIPELINE: Address.make({
    [ChainId.BASE_MAINNET]: '0xb1bE000421A9d890cb51EBd9D593De9C0B199419'
  }),
  UNWRAP_AND_SEND_JUNCTION: Address.make({
    [ChainId.BASE_MAINNET]: '0xfE8ecCF700aA85f84eA7fE7207E165D1721b9572'
  }),
  JUNCTIONS: Address.make({
    [ChainId.BASE_MAINNET]: '0x5A5A5A5AF6db0CDA91d553fE3256dBa53Ce72Ee9'
  }),
  LSD_CHAINLINK_ORACLE: Address.make({
    [ChainId.BASE_MAINNET]: '0x1CD1CD0a74C17F6943a661e26cC68d978e564635'
  })
};
