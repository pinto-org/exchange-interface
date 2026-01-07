import { ChainId, Address } from '@exchange/sdk-core';

export const addresses = {
  // ----------------------------------------
  // Pinto Core Contracts
  // ----------------------------------------
  PINTO_DIAMOND: Address.make({
    [ChainId.BASE_MAINNET]: '0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f'
  }),
  PINTO_PRICE: Address.make({
    [ChainId.BASE_MAINNET]: '0xD0fd333F7B30c7925DEBD81B7b7a4DFE106c3a5E'
  }),

  // ----------------------------------------
  // Ecosystem Contracts
  // ----------------------------------------
  DEPOT: Address.make({
    [ChainId.BASE_MAINNET]: '0xDEb0f0328c86A1C13D3513C70b75A2cEC829E471'
  }),
  PIPELINE: Address.make({
    [ChainId.BASE_MAINNET]: '0xb1bE000a5Dbf61dA9C4162A23958E7B28645c4f0'
  }),
  JUNCTION: Address.make({
    [ChainId.BASE_MAINNET]: '0x5A5A5AF07D8a389472AdC1E60aA71BAC89Fcff8b'
  }),
  UNWRAP_AND_SEND_ETH: Address.make({
    [ChainId.BASE_MAINNET]: '0x5E00369D669015750c8abb84039eB6B8af3DfC23'
  }),
  LSD_CHAINLINK_ORACLE: Address.make({
    [ChainId.BASE_MAINNET]: '0x1CD1CD0f61A4fe185130FFd057b1Edf6A2ab442E'
  }),

  // ----------------------------------------
  // ERC-20 Tokens
  // ----------------------------------------
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
  WSOL: Address.make({
    [ChainId.BASE_MAINNET]: '0x1C61629598e4a901136a81BC138E5828dc150d67'
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

  // ----------------------------------------
  // Wells Contracts
  // ----------------------------------------
  PINTOETH_WELL: Address.make({
    [ChainId.BASE_MAINNET]: '0x3e11001CfbB6dE5737327c59E10afAB47B82B5d3'
  }),
  PINTOCBETH_WELL: Address.make({
    [ChainId.BASE_MAINNET]: '0x3e111115A82dF6190e36ADf0d552880663A4dBF1'
  }),
  PINTOCBBTC_WELL: Address.make({
    [ChainId.BASE_MAINNET]: '0x3e11226fe3d85142B734ABCe6e58918d5828d1b4'
  }),
  PINTOUSDC_WELL: Address.make({
    [ChainId.BASE_MAINNET]: '0x3e1133aC082716DDC3114bbEFEeD8B1731eA9cb1'
  }),
  PINTOWSOL_WELL: Address.make({
    [ChainId.BASE_MAINNET]: '0x3e11444c7650234c748D743D8d374fcE2eE5E6C9'
  }),

  // ----------------------------------------
  // LSD Oracles
  // ----------------------------------------
  PINTOWETH_LSD_ORACLE: Address.make({
    [ChainId.BASE_MAINNET]: '0x71041dddad3595F9CEd3DcCFBe3D1F4b0a16Bb70'
  }),
  PINTOCBETH_LSD_ORACLE: Address.make({
    [ChainId.BASE_MAINNET]: '0xd7818272B9e248357d13057AAb0B417aF31E817d'
  }),
  PINTOCBBTC_LSD_ORACLE: Address.make({
    [ChainId.BASE_MAINNET]: '0x07DA0E54543a844a80ABE69c8A12F22B3aA59f9D'
  }),
  PINTOUSDC_LSD_ORACLE: Address.make({
    [ChainId.BASE_MAINNET]: '0x7e860098F58bBFC8648a4311b374B1D669a2bc6B'
  }),
  PINTOWSOL_LSD_ORACLE: Address.make({
    [ChainId.BASE_MAINNET]: '0x975043adBb80fc32276CbF9Bbcfd4A601a12462D'
  })
};
