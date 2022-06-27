import { PublicKey } from "@solana/web3.js";
import axios from "axios";
import { SearchOptions, Token, UTLApiResponse } from "../types";
import { UtlConfig } from "../config/utl-config";

const fetchFromBackend = async ({ apiUrl, timeout, chainId }: UtlConfig, addresses: PublicKey[]): Promise<UTLApiResponse> => {
  try {
    const response = await axios.post<UTLApiResponse>(`${apiUrl}/v1/mints?chainId=${chainId}`, {
      addresses: addresses.map((address) => address.toString())
    }, { timeout });
    return response.data;
  } catch (e) {
    throw e;
  }
}

const searchFromBackend = async ({ apiUrl, timeout, chainId }: UtlConfig, query: string, { start, limit }: SearchOptions): Promise<UTLApiResponse> => {
  try {
    const response = await axios.get<UTLApiResponse>(`${apiUrl}/v1/search?query=${query}&start=${start}&limit=${limit}&chainId=${chainId}`, { timeout });
    return response.data;
  } catch (e) {
    throw e;
  }
}

export const fetchTokensBackend = async (config: UtlConfig, mints: PublicKey[]): Promise<Token[]> => {
  try {
    const { content } = await fetchFromBackend(config, mints);
    return content;
  } catch (e) {
    throw e;
  }
}

export const searchTokensBackend = async (config: UtlConfig, query: string, options: SearchOptions) => {
  try {
    const { content } = await searchFromBackend(config, query, options);
    return content;
  } catch (e) {
    throw e;
  }
}
