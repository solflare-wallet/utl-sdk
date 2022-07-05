import { Nft } from "@metaplex-foundation/js";
import { Token } from "./types";

export const transformMetaplexToken = (nft: Nft, additionalData: object, decimalsMap: object): Token => {
  return {
    name: nft.name,
    symbol: nft.symbol,
    logoURI: nft.metadata.image ?? null,
    address: nft.mint.toString(),
    decimals: decimalsMap[nft.mint.toString()] || 6,
    ...additionalData
  }
}
