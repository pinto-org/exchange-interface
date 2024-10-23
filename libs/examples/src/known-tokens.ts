import { sdk } from './setup';

const padConfig = {
  symbol: 12,
  name: 36,
  decimals: 4,
  address: 44,
  tokenType: 0
};

function logWithPadEnd(value: string, key: keyof typeof padConfig) {
  return value.padEnd(padConfig[key], ' ');
}

function print(symbol: string, name: string, decimals: string, address: string, tokenType: string) {
  console.log(
    `${symbol.padEnd(padConfig.symbol, ' ')} ${name.padEnd(padConfig.name, ' ')} ${decimals.padEnd(
      padConfig.decimals,
      ' '
    )} ${address.toLowerCase().padEnd(padConfig.address, ' ')} ${tokenType}`
  );
}

sdk.tokens.getMap().forEach((value, key) => {
  const address = value.address.toString().toLowerCase();
  const decimals = value.decimals.toString();
  const name = value.name;
  const symbol = value.symbol.toString();

  console.log(
    `${symbol.padEnd(12, ' ')} ${name.padEnd(36, ' ')} ${decimals.padEnd(
      4,
      ' '
    )} ${address.toLowerCase().padEnd(44, ' ')} ${value.constructor.name}`
  );
});
