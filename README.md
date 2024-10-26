<img src="./exchange-logo.svg" alt="Pinto Exchange" style='align:right; width: 64px; margin-bottom: -18px;' />

# Pinto Exchange UI 

**The exchange interface for the Pinto Protocol: [pinto.exchange](https://pinto.exchange)**

## Getting Started

### Installation

```bash
# Install packages
yarn

# generate ABI types, build packages and app.
yarn build && yarn app:build

# start dev server at http://localhost:2424
yarn app:dev
```

### Environment Variables
```bash
# ./app/.env.local
# See ./app/src/.env.local.example for a full list of available variables
VITE_ALCHEMY_API_KEY=[your alchemy api key] ...
```
