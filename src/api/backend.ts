import { PublicKey } from "@solana/web3.js";
import axios from "axios";
import { Token, UTLApiResponse } from "../types";
import { SDKConfig } from "../config/sdk-config";

const fetchFromBackend = async ({ apiUrl, timeout }: SDKConfig, addresses: PublicKey[]): Promise<UTLApiResponse> => {
  try {
    const response = await axios.post<UTLApiResponse>(`${apiUrl}/v1/mints`, {
      addresses: addresses.map((address) => address.toString())
    }, { timeout });
    return response.data;
  } catch (e) {
    throw e;
  }
}

export const fetchTokensBackend = async (config, mints: PublicKey[]): Promise<Token[]> => {
  try {
    const { content } = await fetchFromBackend(config, mints);
    return content;
  } catch (e) {
    throw e;
  }
}
