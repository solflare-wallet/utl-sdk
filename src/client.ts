import { PublicKey } from "@solana/web3.js";
import { SDKConfig } from "./config/sdk-config";
import { fetchTokensBackend, fetchTokensCdn, fetchTokensMetaplex, searchTokensBackend } from "./api/";
import { publicKeysToMap } from "./utils";
import { SearchOptions } from "./types";

export default class Client {
  constructor(public readonly config: SDKConfig = new SDKConfig()) {}

  public async fetchMint(mint: PublicKey) {
    const token = await this.fetchMints([ mint ]);
    return token[0] ?? null;
  }

  public async fetchMints(mints: PublicKey[]) {
    const tokenlist = await this.getFromTokenList(mints);

    const fetchedPubkeys = publicKeysToMap(tokenlist.map((token) => new PublicKey(token.address)));
    const mintsNotFetched = mints.filter((mint) => !fetchedPubkeys[mint.toString()]);

    const metaplex = await this.getFromMetaplex(mintsNotFetched);

    return [ ...tokenlist, ...metaplex ];
  }

  public async searchMints(query: string, options: SearchOptions = { start: 0, limit: 100 }) {
    return await searchTokensBackend(this.config, query, options);
  }

  private async getFromTokenList(mints: PublicKey[]) {
    try {
      return await fetchTokensBackend(this.config, mints);
    } catch (e) {
      return await fetchTokensCdn(this.config, mints);
    }
  }

  private async getFromMetaplex(mints: PublicKey[]) {
    return await fetchTokensMetaplex(this.config, mints);
  }

}

