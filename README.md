# <p align="center"><a href="https://solflare.com/"><img src="https://solflare.com/assets/logo-icon.26659b6d..svg" height="100" alt="Solflare"></a>

# @solflare-wallet/utl-sdk

SDK used for Unified Token List.

This SDK works by fetching token metadata using a few different strategies: using UTL backend, falling back to
token list hosted on publicly available CDN, and fetching Metaplex metadata for everything else.

Contents:
- [Inspiration behind UTL](#inspiration-for-this-token-list)
- [Installation](#installation)
- [Examples](#examples)
  - [Initialize the library](#initialize-the-library)
  - [Fetching single token](#fetching-single-token)
  - [Fetching multiple tokens](#fetching-multiple-tokens)
  - [Searching tokens](#searching-tokens)

## Inspiration for this token list
As the current token list is coming to its end and being archived, the need for new token list was created.
Previous token list was based on GitHub repo and anybody could create a PR and introduce their mint/token into
that list that was used by whole community. Since PRs were loosely monitored and in huge numbers, that meant
that scam tokens could be found inside the list.

Our proposition is creating an open-source transparent Unified Token List (UTL) that combines credible and
trusted sources of verified token mints across the community.

Everyone will be able to independently generate the UTL, customize the list and use it or just use a
pre-generated one.

Main parts of UTL are:
- [Token List Providers](https://github.com/solflare-wallet/utl-aggregator/tree/master/src/providers)
- [Token List Aggregator](https://github.com/solflare-wallet/utl-aggregator)
- [Token List API](https://github.com/solflare-wallet/utl-api)
- [Token List SDK](https://github.com/solflare-wallet/utl-sdk)

## Installation
```bash
$ npm install @solflare-wallet/utl-sdk
```

## Examples

### Initialize the library

1) Use the default configuration (it will create a new Solana web3 connection with public mainnet-beta rpc):

```ts
import { Client } from '@solflare-wallet/utl-sdk';

const utl = new Client();
```

2) Extend your configuration with other options:

```ts
import { Client, UtlConfig } from '@solflare-wallet/utl-sdk';

const config = new UtlConfig({
  /**
   * 101 - mainnet, 102 - testnet, 103 - devnet
   */
  chainId: 101,
  /**
   * number of miliseconds to wait until falling back to CDN
   */
  timeout: 2000,
  /**
   * Solana web3 Connection
   */
  connection: new Connection('https://api.mainnet-beta.solana.com/'),
  /**
   * Backend API url which is used to query tokens
   */
  apiUrl: "https://token-list-api.solana.cloud",
  /**
   * CDN hosted static token list json which is used in case backend is down
   */
  cdnUrl: "https://cdn.jsdelivr.net/gh/solflare-wallet/token-list/solana-tokenlist.json"
});

const utl = new Client(config);
```

### Fetching a single token
```ts
import { Client, Token } from '@solflare-wallet/utl-sdk';
import { PublicKey } from '@solana/web3.js';

const utl = new Client();
const token: Token = await utl.fetchMint(new PublicKey("So11111111111111111111111111111111111111112"));

token = {
  address: 'So11111111111111111111111111111111111111112',
  chainId: 101,
  name: 'Wrapped Solana',
  symbol: 'SOL',
  verified: true,
  decimals: 9,
  holders: 100000,
  logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
  tags: []
}
```

### Fetching multiple tokens
```ts
import { Client, Token } from '@solflare-wallet/utl-sdk';
import { PublicKey } from '@solana/web3.js';

const mints = [
  new PublicKey("So11111111111111111111111111111111111111112"), // WSOL
  new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"), // USDC
  new PublicKey("FjWWxNDB2uVjeaKR7nVjFjxTau85wVfAzwbLbpmJot3v") // Fake USDC (fetched from Metaplex metadata)
];

const utl = new Client();
const tokens: Token[] = await utl.fetchMints(mints);
```

### Searching tokens
```ts
import { Client, Token } from '@solflare-wallet/utl-sdk';
import { PublicKey } from '@solana/web3.js';

const utl = new Client();
const options = { start: 0, limit: 10 };
const tokens = await utl.searchMints('slrs', options);

tokens = {
  data: [ Token, Token ],
  start: 0,
  limit: 10,
  count: 1234
}
```
