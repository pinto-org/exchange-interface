/// All addresses are in lowercase for consistency

import { ethers } from 'ethers';

import { AddressMap } from 'src/types';

// ---------- METHODS ----------

export const getIsValidEthereumAddress = (address: string | undefined, enforce0Suffix = true): boolean => {
  if (!address) return false;
  if (enforce0Suffix && !address.startsWith('0x')) return false;
  return ethers.utils.isAddress(address ?? '');
};

/**
 * Converts an object or array of objects with an address property to a map of address to object.
 */
export const toAddressMap = <T extends { address: string }>(
  hasAddress: T | T[],
  options?: {
    keyLowercase?: boolean;
  }
) => {
  const arr = Array.isArray(hasAddress) ? hasAddress : [hasAddress];

  return arr.reduce<AddressMap<T>>((prev, curr) => {
    const key = options?.keyLowercase ? curr.address.toLowerCase() : curr.address;
    prev[key] = curr;
    return prev;
  }, {});
};
