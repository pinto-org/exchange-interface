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
    [ChainId.BASE_MAINNET]: '0xDEb0f00B711f90e503D3035E890A19693ef27Db9'
  }),
  PIPELINE: Address.make({
    [ChainId.BASE_MAINNET]: '0xb1bE000421A9d890cb51EBd9D593De9C0B199419'
  }),
  JUNCTION: Address.make({
    [ChainId.BASE_MAINNET]: '0x5A5A5A5AF6db0CDA91d553fE3256dBa53Ce72Ee9'
  }),
  UNWRAP_AND_SEND_ETH: Address.make({
    [ChainId.BASE_MAINNET]: '0xfE8ecCF700aA85f84eA7fE7207E165D1721b9572'
  }),
  LSD_CHAINLINK_ORACLE: Address.make({
    [ChainId.BASE_MAINNET]: '0x1CD1CD0a74C17F6943a661e26cC68d978e564635'
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
    [ChainId.BASE_MAINNET]: '0x3e11002e8E77B77AC4AeDCD9dd251d207227F686'
  }),
  PINTOWSTETH_WELL: Address.make({
    [ChainId.BASE_MAINNET]: '0x3e1111d74307ACc2FC12F3B5cbd7b5eDFee08C06'
  }),
  PINTOWEETH_WELL: Address.make({
    [ChainId.BASE_MAINNET]: '0x3e1122552d8F42E8EaFc01E69D63aB3c60579a65'
  }),
  PINTOCBETH_WELL: Address.make({
    [ChainId.BASE_MAINNET]: '0x3e11339Ff6A111A2810974941624Da4e997D253A'
  }),
  PINTOCBBTC_WELL: Address.make({
    [ChainId.BASE_MAINNET]: '0x3e11442481e80AB40717A5C7aec2139Feaaac14d'
  }),
  PINTOUSDC_WELL: Address.make({
    [ChainId.BASE_MAINNET]: '0x3e115573f7F22029EdF4e6155d2DA0Ba379Dc45d'
  }),

  // ----------------------------------------
  // LSD Oracles
  // ----------------------------------------
  PINTOWETH_LSD_ORACLE: Address.make({
    [ChainId.BASE_MAINNET]: '0x71041dddad3595F9CEd3DcCFBe3D1F4b0a16Bb70'
  }),
  PINTOWSTETH_LSD_ORACLE: Address.make({
    [ChainId.BASE_MAINNET]: '0x1CD1CD0a74C17F6943a661e26cC68d978e564635'
  }),
  PINTOWEETH_LSD_ORACLE: Address.make({
    [ChainId.BASE_MAINNET]: '0x1CD1CD0a74C17F6943a661e26cC68d978e564635'
  }),
  PINTOCBETH_LSD_ORACLE: Address.make({
    [ChainId.BASE_MAINNET]: '0xd7818272B9e248357d13057AAb0B417aF31E817d'
  }),
  PINTOCBBTC_LSD_ORACLE: Address.make({
    [ChainId.BASE_MAINNET]: '0x07DA0E54543a844a80ABE69c8A12F22B3aA59f9D'
  }),
  PINTOUSDC_LSD_ORACLE: Address.make({
    [ChainId.BASE_MAINNET]: '0x7e860098F58bBFC8648a4311b374B1D669a2bc6B'
  })
};
