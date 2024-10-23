export type Lookup<T> = Record<string, T>;

export type SymbolLookup<T> = Lookup<T>;

export type AddressLookup<T> = Lookup<T>;

export type MayPromise<T> = Promise<T> | T;

// Primitives
export type Primitive = string | number | boolean | null | undefined;

export type MayDeepArray<T> = T | Array<MayDeepArray<T>>;

export type ArrayItem<T extends ReadonlyArray<any>> = T extends Array<infer P> ? P : never;

// Functions
export type MayFunction<T, PS extends any[] = []> = T | ((...Params: PS) => T);

// Objects
export type ExactPartial<T, U> = {
  [P in Extract<keyof T, U>]?: T[P];
} & {
  [P in Exclude<keyof T, U>]: T[P];
};

export type ExactRequired<T, U> = {
  [P in Extract<keyof T, U>]-?: T[P];
} & {
  [P in Exclude<keyof T, U>]: T[P];
};

/**
 * extract only string and number
 */
export type SKeyof<O> = Extract<keyof O, string>;

export type GetValue<T, K> = K extends keyof T ? T[K] : undefined;

/**
 * Usage
 * ----------------------------------------------------------------------------
 * interface Person {
 * name: string;
 * age: number;
 * }
 * type NameType = GetValue<Person, 'name'>; // string
 * type HeightType = GetValue<Person, 'height'>; // undefined
 */

export type Unpacked<T> = T extends (infer U)[] ? U : T;
