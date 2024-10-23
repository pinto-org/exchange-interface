<img src="https://github.com/BeanstalkFarms/Beanstalk-Brand-Assets/blob/main/BEAN/bean-128x128.png" alt="Beanstalk logo" align="right" width="120" />

# Exchange-pinto SDK

This is a JavaScript SDK for the [Exchange-pinto](https://pinto.money/) web app.

The current version of the Exchange-pinto SDK is considered a beta release. The codebase is novel and has not been tested in the "real world" prior to use by Root and Paradox. Use of the Exchange-pinto SDK could result in loss of funds, whether due to bugs or misuse.

The SDK is dependent on Exchange-pinto, and therefore inherits all of the risks associated with Exchange-pinto. The security of Exchange-pinto is assumed. For an exhaustive list, consult the [Pinto whitepaper](https://pinto.money/docs/exchange-pinto.pdf) and [Exchange-pinto DAO Disclosures](https://docs.pinto.money/).

## Using the SDK

Create an instance

```javascript
import { ExchangeSDK } from "@exchange/sdk";

const sdk = new ExchangeSDK(options);
```

SDK contructor options:

```javascript
const options = {
  // etherjs Signer. Optional
  signer,

  // etherjs Provider. Optional
  provider,

  // rpcUrl
  rpcUrl,

  // bool, print debug output. default `false`
  DEBUG
};
```

- `options` object is optional. If ommited, SDK will use an `ethers.getDefaultProvider()`
- If `rpcUrl` is provided, SDK will use a `WebSocketProvider` or `JsonRpcProvider`, depending on the protocol in the url (`ws` vs `http`)
- If `signer` is provided, `sdk.provider` will be set to `signer.provider`

## Library Exports

The following objects are available for import from the library:

```javascript
import {
  ExchangeSDK,
  Utils,
  TokenValue
  Token,
  NativeToken,
  ERC20Token,,
  Address,
  ChainID
} from "@exchange/sdk";
```

## Example

#### Swap 1.5 ETH to BEAN

```typescript
const sdk = new ExchangeSDK({ signer });

const fromToken = sdk.tokens.ETH;
const toToken = sdk.tokens.PINTO;
const account = signer.address;
const amount = sdk.tokens.ETH.amount(1.5);
const slippage = 0.1; // 0.1% : 0.1/100

const swap = sdk.swap.buildSwap(fromToken, toToken, account);
const est = await swap.estimate(amount);

console.log(`You'd receive ${est.toHuman()} ${toToken.symbol}`);

const txr = await swap.execute(amount, slippage);
await txr.wait();
```

