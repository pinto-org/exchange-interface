import { sdk } from './setup';

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
