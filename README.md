<img src="./exchange-logo.svg" alt="Pinto Exchange" style='width: 120px;' />

# Pinto Exchange UI 

**The exchange interface for the Pinto Protocol: [pinto.exchange](https://pinto.exchange)**

## Getting Started

### Installation

```bash
# Install packages
yarn

# generate ABI types, build packages and app.
yarn build && yarn app:build
```

### Environment Variables
```bash
# ./app/.env.local
# See ./app/.env.local.example for a full list of available variables
VITE_ALCHEMY_API_KEY=[your alchemy api key] ...
```

### Running the site

```bash

# start an anvil fork of Base on chain id 1337
anvil --fork-url <fork rpc url here> --chain-id 1337

# start dev server at http://localhost:2424
yarn app:dev

```

## Code of Conduct

This project adheres to a [Code of Conduct](CODE_OF_CONDUCT.md) to ensure a welcoming and inclusive environment for all contributors.

## License

[MIT](https://github.com/pintomoney/exchange-interface/blob/main/LICENSE.txt)
