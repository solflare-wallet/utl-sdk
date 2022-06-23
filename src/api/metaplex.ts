import { Metaplex, Nft } from "@metaplex-foundation/js-next";
import { Connection, PublicKey } from "@solana/web3.js";
import { transformMetaplexToken } from "../transformers";
import { Token } from "../types";
import { SDKConfig } from "../config/sdk-config";

const getNftMetadata = async (connection: Connection, mints: PublicKey[]) => {
  const metaplex = new Metaplex(connection);
  const nfts = await metaplex.nfts().findAllByMintList(mints);
  return nfts.filter(Boolean) as Nft[];
}

export const fetchTokensMetaplex = async ({ connection, chainId }: SDKConfig, mints: PublicKey[]): Promise<Token[]> => {
  const accounts = await getNftMetadata(connection, mints);

  const promises = accounts.map(async (nft) => {
    try {
      await nft.metadataTask.run();
      return nft;
    } catch {
      return nft;
    }
  });

  await Promise.all(promises);

  return accounts.map((account) => {
    return transformMetaplexToken(account, { chainId, verified: false, source: 'METAPLEX' });
  });
}

