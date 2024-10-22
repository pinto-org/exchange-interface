import { Address, ChainId } from '@basen/sdk-core';

export const addresses = {
  // Tokens
  PINTO: Address.make({
    [ChainId.BASE_MAINNET]: '0xBEA0000029AD1c77D3d5D23Ba2D8893dB9d1Efab',
  }),
  WETH: Address.make({
    [ChainId.BASE_MAINNET]: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  }),
  WSTETH: Address.make({
    [ChainId.BASE_MAINNET]: '0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0',
  }),
  WEETH: Address.make({
    [ChainId.BASE_MAINNET]: '0xCd5fE23C85820F7B72D0926FC9b05b43E359b7ee',
  }),
  WBTC: Address.make({
    [ChainId.BASE_MAINNET]: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
  }),
  USDC: Address.make({
    [ChainId.BASE_MAINNET]: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  }),
  USDT: Address.make({
    [ChainId.BASE_MAINNET]: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  }),
  DAI: Address.make({
    [ChainId.BASE_MAINNET]: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  }),
  STETH: Address.make({
    [ChainId.BASE_MAINNET]: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84',
  }),

  // Contracts
  DEPOT: Address.make({
    [ChainId.BASE_MAINNET]: '0xDEb0f00071497a5cc9b4A6B96068277e57A82Ae2',
  }),
  PIPELINE: Address.make({
    [ChainId.BASE_MAINNET]: '0xb1bE0000C6B3C62749b5F0c92480146452D15423',
  }),
  WETH9: Address.make({
    [ChainId.BASE_MAINNET]: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  }),
  UNWRAP_AND_SEND_JUNCTION: Address.make({
    [ChainId.BASE_MAINNET]: '0x737Cad465B75CDc4c11B3E312Eb3fe5bEF793d96',
  }),

  // ---- Well Components ----
  // Pumps
  MULTI_FLOW_PUMP_V1_1: Address.make({
    [ChainId.BASE_MAINNET]: '0xBA51AaaAa95bA1d5efB3cB1A3f50a09165315A17',
  }),

  // Well Functions
  CONSTANT_PRODUCT_2_V2: Address.make({
    [ChainId.BASE_MAINNET]: '0xBA150C2ae0f8450D4B832beeFa3338d4b5982d26',
  }),
  STABLE2: Address.make({
    [ChainId.BASE_MAINNET]: '0xba150052e11591D0648b17A0E608511874921CBC',
  }),

  // Well Implementations
  WELL_DOT_SOL: Address.make({
    [ChainId.BASE_MAINNET]: '0xba510e11eeb387fad877812108a3406ca3f43a4b',
  }),

  STABLE2_LOOKUP: Address.make({
    [ChainId.BASE_MAINNET]: '0xBA51055dAD14d3920e1798D2e8A152d91CaDb461',
  }),

  /**
   * @deprecated
   * @note Use `MULTI_FLOW_PUMP_V1_1` for new wells instead
   */
  MULTI_FLOW_PUMP_V1: Address.make({
    [ChainId.BASE_MAINNET]: '0xBA510f10E3095B83a0F33aa9ad2544E22570a87C',
  }),
  /**
   * @deprecated
   * @note Use `CONSTANT_PRODUCT_2_V2` for new wells instead
   */
  CONSTANT_PRODUCT_2_V1: Address.make({
    [ChainId.BASE_MAINNET]: '0xba510c20fd2c52e4cb0d23cfc3ccd092f9165a6e',
  }),
};
