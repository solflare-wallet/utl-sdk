import EventEmitter from "eventemitter3";
import { PublicKey } from "@solana/web3.js";
import { UtlConfig } from "./config/utl-config";
import { fetchTokensBackend, fetchTokensCdn, fetchTokensMetaplex, searchTokensBackend } from "./api/";
import { publicKeysToMap } from "./utils";
import { SearchOptions, UTLOnAccountsLoadedCallback, UTLSource } from './types';

export default class Client extends EventEmitter {
  constructor(public readonly config: UtlConfig = new UtlConfig()) {
    super();
  }

  public async fetchMint(mint: PublicKey) {
    const token = await this.fetchMints([ mint ]);
    return token[0] ?? null;
  }

  public async fetchMints(mints: PublicKey[]) {
    const tokenlist = await this.getFromTokenList(mints);

    this.emit('tokens', { tokens: tokenlist, source: UTLSource.API });

    const fetchedPubkeys = publicKeysToMap(tokenlist.map((token) => new PublicKey(token.address)));
    const mintsNotFetched = mints.filter((mint) => !fetchedPubkeys[mint.toString()]);

    const metaplex = await this.getFromMetaplex(mintsNotFetched, (metaplexPartial) => {
      this.emit('tokens', { tokens: [ ...tokenlist, ...metaplexPartial ], source: UTLSource.CHAIN });
    });

    const data = [ ...tokenlist, ...metaplex ];

    this.emit('tokens', { tokens: data, source: UTLSource.METADATA });

    return data;
  }

  public async searchMints(query: string, options: SearchOptions = { start: 0, limit: 100 }) {
    return await searchTokensBackend(this.config, query, options);
  }

  public async getFromTokenList(mints: PublicKey[]) {
    try {
      return await fetchTokensBackend(this.config, mints);
    } catch (e) {
      return await fetchTokensCdn(this.config, mints);
    }
  }

  public async getFromMetaplex(mints: PublicKey[], onAccountsLoaded: UTLOnAccountsLoadedCallback = () => null) {
    return await fetchTokensMetaplex(this.config, mints, onAccountsLoaded);
  }

}

