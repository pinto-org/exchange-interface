import { ERC20Token } from './ERC20Token';
import { Token } from './Token';

export function getTokenIndex(token: Token) {
  if (token instanceof ERC20Token) {
    return token.address.toLowerCase();
  }
  return token.symbol.toLowerCase();
}

export function getTokenSymbolIndex(token: Token) {
  return token.symbol.toLowerCase();
}
