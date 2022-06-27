import { Token, UTLCdnTokenList } from "../types";
import axios from "axios";
import { publicKeysToMap } from "../utils";
import { PublicKey } from "@solana/web3.js";
import { UtlConfig } from "../config/utl-config";

const downloadTokenlist = async (cdnUrl): Promise<UTLCdnTokenList | null> => {
  try {
    const { data } = await axios.get<UTLCdnTokenList>(cdnUrl);
    return data;
  } catch {
    return null;
  }
}

export const fetchTokensCdn = async ({ cdnUrl }: UtlConfig, mints: PublicKey[]): Promise<Token[]> => {
  const tokenlist = await downloadTokenlist(cdnUrl);
  const mintsMap = publicKeysToMap(mints);

  return tokenlist?.tokens.filter((token) => mintsMap[token.address]) ?? [];
}
