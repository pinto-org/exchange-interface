import Pool from 'src/classes/Pool/Pool';
import { BasinWell } from 'src/classes/Pool/BasinWell';
import { DiamondSDK } from 'src/lib/DiamondSDK';
import { Token } from '@exchange/sdk-core';

export class Pools {
  static sdk: DiamondSDK;

  public readonly PINTO_ETH_WELL: BasinWell;
  public readonly PINTO_CBETH_WELL: BasinWell;
  public readonly PINTO_WEETH_WELL: BasinWell;
  public readonly PINTO_WSTETH_WELL: BasinWell;
  public readonly PINTO_CBBTC_WELL: BasinWell;
  public readonly PINTO_USDC_WELL: BasinWell;
  public readonly PINTO_WSOL_WELL: BasinWell;

  public readonly wells: Set<BasinWell>;

  private addressMap = new Map<string, BasinWell>();

  constructor(sdk: DiamondSDK) {
    Pools.sdk = sdk;

    const wells = new Set<BasinWell>();

    ////// Basin Wells
    this.PINTO_ETH_WELL = new BasinWell(
      sdk,
      sdk.addresses.PINTOETH_WELL.get(sdk.chainId),
      sdk.tokens.PINTO_ETH_WELL_LP,
      [sdk.tokens.PINTO, sdk.tokens.WETH],
      {
        name: 'PINTO:ETH Well LP',
        logo: '',
        symbol: 'PINTO:ETH',
        color: '#ed9f9c'
      }
    );
    this.PINTO_CBETH_WELL = new BasinWell(
      sdk,
      sdk.addresses.PINTOCBETH_WELL.get(sdk.chainId),
      sdk.tokens.PINTO_CBETH_WELL_LP,
      [sdk.tokens.PINTO, sdk.tokens.CBETH],
      {
        name: 'PINTO:cbETH Well LP',
        logo: '',
        symbol: 'PINTO:cbETH',
        color: '#ed9f9c'
      }
    );
    this.PINTO_CBBTC_WELL = new BasinWell(
      sdk,
      sdk.addresses.PINTOCBBTC_WELL.get(sdk.chainId),
      sdk.tokens.PINTO_CBBTC_WELL_LP,
      [sdk.tokens.PINTO, sdk.tokens.CBBTC],
      {
        name: 'PINTO:cbBTC Well LP',
        logo: '',
        symbol: 'PINTO:cbBTC',
        color: '#ed9f9c'
      }
    );
    this.PINTO_USDC_WELL = new BasinWell(
      sdk,
      sdk.addresses.PINTOUSDC_WELL.get(sdk.chainId),
      sdk.tokens.PINTO_USDC_WELL_LP,
      [sdk.tokens.PINTO, sdk.tokens.USDC],
      {
        name: 'PINTO:USDC Well LP',
        logo: '',
        symbol: 'BEAN:USDC',
        color: '#ed9f9c'
      }
    );
    this.PINTO_WSOL_WELL = new BasinWell(
      sdk,
      sdk.addresses.PINTOWSOL_WELL.get(sdk.chainId),
      sdk.tokens.PINTO_WSOL_WELL_LP,
      [sdk.tokens.PINTO, sdk.tokens.WSOL],
      {
        name: 'PINTO:WSOL Well LP',
        logo: '',
        symbol: 'PINTO:WSOL',
        color: '#ed9f9c'
      }
    );

    wells.add(this.PINTO_ETH_WELL);
    wells.add(this.PINTO_CBETH_WELL);
    wells.add(this.PINTO_CBBTC_WELL);
    wells.add(this.PINTO_USDC_WELL);
    wells.add(this.PINTO_WSOL_WELL);
    
    this.wells = wells;

    this.wells.forEach((well) => {
      this.addressMap.set(this.getWellIndex(well), well);
    });
  }

  isWhitelisted(well: { address: string } | string): boolean {
    const address = typeof well === 'string' ? well : well.address;
    try {
      const _well = this.deriveWell(address);
      return this.wells.has(_well);
    } catch (e) {
      return false;
    }
  }

  getWellByLPToken(token: Token | string): BasinWell | undefined {
    if (typeof token === 'string') {
      return this.addressMap.get(token.toLowerCase());
    }
    return this.addressMap.get(token.address);
  }

  getWells(): readonly BasinWell[] {
    return Array.from(this.wells) as ReadonlyArray<BasinWell>;
  }

  /**
   * Derives a Well object from either a Well object or a well address.
   * @param well - Either a Well object or a string representing the well's address.
   * @returns The corresponding Well object.
   * @throws Error if a well with the given address is not found in the addressMap.
   */
  private deriveWell(well: { address: string } | string): BasinWell {
    const address = typeof well === 'string' ? well : well.address;

    const _well = this.addressMap.get(address);
    if (!_well) {
      throw new Error(`Well with address ${address} not found`);
    }
    return _well as BasinWell;
  }

  private getWellIndex(well: BasinWell): string {
    return well.address.toLowerCase();
  }
}
