import { ethers } from 'ethers';
import { ChainId, ChainResolver } from '@exchange/sdk-core';

import { enumFromValue } from 'src/utils';
import { addresses } from 'src/constants';
import { Tokens } from './tokens';
import { Contracts } from './contracts';
import { Silo } from './silo';
import { Sun } from './sun';
import { Farm } from './farm/farm';
import { Pinto } from './pinto';
import { Pools } from './pools';
import { ZeroX } from './matcha';
import { Swap } from './swap';

export type Provider = ethers.providers.JsonRpcProvider;
export type Signer = ethers.Signer;
export type BeanstalkConfig = Partial<{
  provider: Provider;
  signer: Signer;
  rpcUrl: string;
  DEBUG: boolean;
  zeroXApiKey?: string;
}>;

export class DiamondSDK {
  public DEBUG: boolean;
  public signer?: Signer;
  public provider: Provider;
  public providerOrSigner: Signer | Provider;
  public lastRefreshTimestamp: number;

  public static addresses: typeof addresses = addresses;

  public readonly chainId: ChainId;
  public readonly contracts: Contracts;
  public readonly tokens: Tokens;
  public readonly pools: Pools;
  public readonly zeroX: ZeroX;

  public readonly farm: Farm;
  public readonly silo: Silo;
  public readonly sun: Sun;
  public readonly swap: Swap;
  public readonly pinto: Pinto;

  get addresses() {
    return DiamondSDK.addresses;
  }

  constructor(config?: BeanstalkConfig) {
    this.handleConfig(config);

    this.chainId = this.deriveChainId();

    // Pinto
    this.pinto = new Pinto(this);

    // Globals
    this.contracts = new Contracts(this);
    this.tokens = new Tokens(this);
    this.pools = new Pools(this);
    this.zeroX = new ZeroX(this, config?.zeroXApiKey);

    // Facets
    this.silo = new Silo(this);
    this.sun = new Sun(this);
    this.farm = new Farm(this);

    // Ecosystem
    this.swap = new Swap(this);

    this.lastRefreshTimestamp = Date.now();
  }

  debug(...args: any[]) {
    if (!this.DEBUG) return;
    console.debug(...args);
  }

  ////// Configuration //////

  handleConfig(config: BeanstalkConfig = {}) {
    if (config.rpcUrl) {
      config.provider = this.getProviderFromUrl(config.rpcUrl, config);
    }

    this.signer = config.signer;
    if (!config.provider && !config.signer) {
      console.log('WARNING: No provider or signer specified, using DefaultProvider.');
      this.provider = ethers.getDefaultProvider() as Provider;
    } else {
      this.provider = (config.signer?.provider as Provider) ?? config.provider!;
    }
    this.providerOrSigner = config.signer ?? config.provider!;

    this.DEBUG = config.DEBUG ?? false;
  }

  ////// Private

  private getProviderFromUrl(url: string, config: BeanstalkConfig): Provider {
    const provider = config.signer ? (config.signer.provider as Provider) : config.provider;
    const networkish = provider?._network || provider?.network || ChainResolver.defaultChainId;

    if (url.startsWith('ws')) {
      return new ethers.providers.WebSocketProvider(url, networkish);
    }
    if (url.startsWith('http')) {
      return new ethers.providers.JsonRpcProvider(url, networkish);
    }

    throw new Error('Invalid rpcUrl');
  }

  private deriveChainId() {
    const { _network, network } = this.provider || {};
    const providerChainId = _network?.chainId || network?.chainId || ChainResolver.defaultChainId;

    return enumFromValue(providerChainId, ChainId);
  }

  async getAccount(_account?: string): Promise<string> {
    if (_account) return _account.toLowerCase();
    if (!this.signer) throw new Error('Cannot get account without a signer');
    const account = await this.signer.getAddress();
    if (!account) throw new Error('Failed to get account from signer');
    return account.toLowerCase();
  }

  /**
   * This methods helps serialize the SDK object. When used in a react
   * dependency array, the signer and provider objects have circular references
   * which cause errors. This overrides the result and allows using the sdk
   * in dependency arrays (which use .toJSON under the hood)
   * @returns
   */
  toJSON() {
    return {
      chainId: this.chainId,
      lastRefreshTimestamp: this.lastRefreshTimestamp,
      provider: {
        url: this.provider?.connection?.url,
        network: this.provider?._network
      },
      signer: this.signer
        ? {
            provider: {
              // @ts-ignore
              network: this.signer?.provider?._network
            },
            // @ts-ignore
            address: this.signer?._address
          }
        : undefined
    };
  }
}
