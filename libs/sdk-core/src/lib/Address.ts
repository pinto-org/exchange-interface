import { ChainId } from 'src/constants/chains';
import { ChainResolver } from 'src/lib/ChainResolver';

export type AddressDefinition = Record<number, string>;

export class Address {
  private addresses: AddressDefinition;

  static make<T extends string | AddressDefinition>(input: T): Address {
    const addresses: AddressDefinition = typeof input === 'string' ? { [ChainResolver.defaultChainId]: input } : input;

    return new Address(addresses);
  }

  constructor(addresses: AddressDefinition) {
    this.addresses = Object.fromEntries(
      Object.entries(addresses).map(([key, value]) => [Number(key), (value || '').toLowerCase()] as const)
    );
  }

  get(chainId: number = ChainResolver.defaultChainId) {
    ChainResolver.validateChainId(chainId);

    if (ChainResolver.isTestnet(chainId)) {
      // return the address for the chainId if it exists.
      if (this.addresses[chainId]) {
        return this.addresses[chainId];
      }

      // return the address for this chainId's mainnet counterpart.
      return this.addresses[ChainResolver.resolveToMainnetChainId(chainId)] || '';
    }

    return this.addresses[chainId] || '';
  }

  set<T extends string | AddressDefinition>(input: T) {
    const newAddress = Address.make(input);
    Object.assign(this.addresses, newAddress.addresses);
  }

  get BASE_MAINNET(): string {
    return this.get(ChainId.BASE_MAINNET);
  }
  get LOCALHOST(): string {
    return this.get(ChainId.LOCALHOST);
  }
  get TESTNET(): string {
    return this.get(ChainId.TESTNET);
  }
}
