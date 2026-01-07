import { TokenValue, Decimal } from '@exchange/sdk-core';
import { BigNumber } from 'ethers';

export type EnumStr = string & {};
export type Primitive = boolean | number | string | bigint;
export type StringNumber = string | number;
export type ObjectNotArray = { [key: string]: any };

export type AnyFn = (...args: any[]) => any;
export type AnyObj = { [key: string]: any };
export type AnyArr = any[];

export type MayFunction<T, Params extends any[] = []> = T | ((...params: Params) => T);
export type MayPromise<T> = T | Promise<T>;
export type MayArray<T> = T | T[];
export type DeMayArray<T extends MayArray<any>> = T extends any[] ? T[number] : T;

export type NotFunctionValue = Exclude<any, AnyFn>;
export type Stringish = Primitive | Nullish | { toString(): any };
export type Nullish = undefined | null;
export type Numberish = number | string | bigint | BigNumber | Decimal | TokenValue;
export type BooleanLike = unknown; // any value that can transform to boolean

export type Entry<Key = any, Value = any> = [Key, Value];

export type Entriesable<Key = any, Value = any> =
  | [Key, Value][] // already is entries
  | AnyCollection<Key, Value>;

export type AnyCollection<Key = any, Value = any> =
  | Array<Value>
  | Set<Value>
  | Map<Key, Value>
  | Record<Key & string, Value>;

/**
 * e.g. mintAdress
 */
export type AdressKey = string;
export type ID = string;

/** a string of readless charateries (like: base64 string)  */
export type HexAddress = string;

/** a string of charateries represent a link href */
export type LinkAddress = string;

export type DateInfo = string | number | Date;

export type Awaited<T> = T extends PromiseLike<infer U> ? U : T;
