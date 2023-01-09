import { Metaplex, Nft } from "@metaplex-foundation/js";
import { TokenStandard } from "@metaplex-foundation/mpl-token-metadata";
import { Connection, PublicKey } from "@solana/web3.js";
import { transformMetaplexToken } from "../transformers";
import { Token } from "../types";
import { UtlConfig } from "../config/utl-config";
import { getMultipleAccounts } from "../utils";

const TIMEOUT = 5000;

const getNftMetadata = async (connection: Connection, mints: PublicKey[]) => {
  const metaplex = new Metaplex(connection);
  const nfts = await metaplex.nfts().findAllByMintList(mints);
  return nfts.filter((nft) => nft?.tokenStandard === TokenStandard.Fungible) as Nft[];
}

export const fetchTokensMetaplex = async ({ connection, chainId }: UtlConfig, mints: PublicKey[]): Promise<Token[]> => {
  const accounts = await getNftMetadata(connection, mints);
  const mintsToFetch: PublicKey[] = [];

  const promises = accounts.map(async (nft) => {
    mintsToFetch.push(nft.mint)
    try {
      // @ts-ignore
      const abortController = new AbortController();
      setTimeout(() => abortController.abort(), TIMEOUT);
      await nft.metadataTask.run({ signal: abortController.signal as any });
      return nft;
    } catch {
      return nft;
    }
  });

  await Promise.all(promises);

  // Fetch decimals for all mints with metadata in a single call
  const decimalsMap = {};
  if (mintsToFetch.length > 0) {
    const parsedAccounts = await getMultipleAccounts(
      connection.rpcEndpoint,
      mintsToFetch.map((key) => key.toString()),
      'jsonParsed'
    );

    parsedAccounts.forEach(({ pubkey, data }) => {
      decimalsMap[pubkey] = data.parsed.info.decimals;
    });
  }

  return accounts.map((account) => {
    return transformMetaplexToken(account, { chainId, verified: false, source: 'METAPLEX' }, decimalsMap);
  });
}

