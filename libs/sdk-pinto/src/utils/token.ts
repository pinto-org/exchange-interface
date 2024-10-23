import { NativeToken, ERC20Token, Token } from '@exchange/sdk-core';

export function isERC20Token(token: Token): token is ERC20Token {
  return token instanceof ERC20Token;
}

export function isNativeToken(token: Token): token is NativeToken {
  return token instanceof NativeToken;
}
