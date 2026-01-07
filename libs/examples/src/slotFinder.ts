import { ExchangeSDK } from '@exchange/sdk';
import { utils, Contract, BigNumber, ethers } from 'ethers';

interface SlotInfo {
  slot: bigint;
  isVyper: boolean;
}

const abi = [
  {
    constant: true,
    inputs: [],
    name: 'name',
    outputs: [{ name: '', type: 'string' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: '_spender', type: 'address' },
      { name: '_value', type: 'uint256' }
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: '_from', type: 'address' },
      { name: '_to', type: 'address' },
      { name: '_value', type: 'uint256' }
    ],
    name: 'transferFrom',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', type: 'string' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: '_to', type: 'address' },
      { name: '_value', type: 'uint256' }
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      { name: '_owner', type: 'address' },
      { name: '_spender', type: 'address' }
    ],
    name: 'allowance',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  { payable: true, stateMutability: 'payable', type: 'fallback' },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'owner', type: 'address' },
      { indexed: true, name: 'spender', type: 'address' },
      { indexed: false, name: 'value', type: 'uint256' }
    ],
    name: 'Approval',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'from', type: 'address' },
      { indexed: true, name: 'to', type: 'address' },
      { indexed: false, name: 'value', type: 'uint256' }
    ],
    name: 'Transfer',
    type: 'event'
  }
] as const;

export class BalanceSlotFinder {
  sdk: ExchangeSDK;

  constructor(sdk: ExchangeSDK) {
    this.sdk = sdk;
  }

  async findBalancesSlot(tokenAddr: string): Promise<SlotInfo> {
    const token = new Contract(tokenAddr.toString(), abi, this.sdk.provider);
    const randomAddress = '0x8b359fb7a31620691dc153cddd9d463259bcf29b';

    const probeValue = BigNumber.from(35600);
    const encodedBalance = utils.defaultAbiCoder.encode(['uint'], [probeValue]);

    for (let i = 0n; i < 100; i++) {
      const userBalanceSlot = utils.hexStripZeros(
        utils.keccak256(utils.defaultAbiCoder.encode(['address', 'uint'], [randomAddress, i]))
      );
      await this.setStorageAt(tokenAddr, userBalanceSlot, encodedBalance);
      const balance: BigNumber = await token.balanceOf(randomAddress);
      if (balance.eq(probeValue)) {
        return { slot: i, isVyper: false };
      }
    }

    for (let i = 0n; i < 100; i++) {
      const userBalanceSlot = utils.hexStripZeros(
        utils.keccak256(utils.defaultAbiCoder.encode(['uint', 'address'], [i, randomAddress]))
      );
      await this.setStorageAt(tokenAddr, userBalanceSlot, encodedBalance);
      const balance: BigNumber = await token.balanceOf(randomAddress);
      if (balance.eq(probeValue)) {
        return { slot: i, isVyper: true };
      }
    }
    throw new Error('Balances slot not found');
  }

  async setBalance(
    tokenAddr: string,
    slotInfo: SlotInfo,
    account: string,
    balance: string // decimal
  ) {
    const token = new Contract(tokenAddr.toString(), abi, this.sdk.provider);

    const _balance = typeof balance === 'number' ? token.amount(balance) : balance;
    const balanceAmount = _balance.toBigNumber();

    const values = [account, slotInfo.slot];

    if (slotInfo.isVyper) values.reverse();

    const index = ethers.utils.solidityKeccak256(['uint256', 'uint256'], values);
    await this.setStorageAt(tokenAddr, index.toString(), this.toBytes32(balanceAmount).toString());
  }

  private toBytes32(bn: ethers.BigNumber) {
    return ethers.utils.hexlify(ethers.utils.zeroPad(bn.toHexString(), 32));
  }

  private async setStorageAt(address: string, index: string, value: string) {
    return this.sdk.provider.send('hardhat_setStorageAt', [address, index, value]);
  }
}
