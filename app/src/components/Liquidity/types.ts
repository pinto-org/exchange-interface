import { TokenValue } from '@exchange/sdk-core';

export enum REMOVE_LIQUIDITY_MODE {
  Balanced,
  OneToken,
  Custom
}

export type LiquidityAmounts = {
  [key: number]: TokenValue;
};

export enum LIQUIDITY_OPERATION_TYPE {
  ADD,
  REMOVE
}
