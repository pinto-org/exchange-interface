import { Well } from '@exchange/sdk';

export const formatWellTokenSymbols = (well: Well | undefined, separator?: string) => {
  const tokenNames = well?.tokens?.map((token) => token.symbol);
  return tokenNames?.join(separator || ':');
};
