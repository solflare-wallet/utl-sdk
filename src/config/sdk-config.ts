import { Connection } from '@solana/web3.js'

const DEFAULT_PROVIDER_URL = 'https://api.mainnet-beta.solana.com/';
const DEFAULT_API_URL = 'https://tokenlist.solflare.com/api';
const DEFAULT_CDN_URL = 'https://cdn.jsdelivr.net/gh/solflare-wallet/token-list/solana-tokenlist.json';

export class SDKConfig {
  connection = new Connection(DEFAULT_PROVIDER_URL);
  apiUrl = DEFAULT_API_URL;
  cdnUrl = DEFAULT_CDN_URL;

  constructor(configOverrides: Partial<SDKConfig> = {}) {
    Object.assign(this, configOverrides)
  }
}
