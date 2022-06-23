import { Nft } from "@metaplex-foundation/js-next";
import { Token } from "./types";

export const transformMetaplexToken = (nft: Nft, additionalData: object): Token => {
  return {
    name: nft.name,
    symbol: nft.symbol,
    logoURI: nft.metadata.image ?? null,
    address: nft.mint.toString(),
    ...additionalData
  }
}
