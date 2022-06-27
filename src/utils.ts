import { PublicKey } from "@solana/web3.js";
import { chain, chunk } from "lodash";
import axios from "axios";

interface keysMapType {
  [key: string]: boolean
}

export const publicKeysToMap = (keys: PublicKey[]): keysMapType => {
  return keys.reduce((acc, cur) => {
    acc[cur.toString()] = true;
    return acc;
  }, {})
}

export async function rpcRequest (url, body, retries = 3, timeoutSec = 30) {
  try {
    const { data } = await axios.post(url, body, { timeout: timeoutSec * 1000 });

    if (data?.error) {
      // we want to retry when response has an error
      throw new Error('Retry');
    }
    return data;
  } catch (e) {
    return retries > 0 ? rpcRequest(url, body, retries - 1, timeoutSec) : null;
  }
}

export async function getMultipleAccounts (url: string, accounts: string[], encoding: "jsonParsed" | "base64" = 'base64') {
  const CHUNK_ACCOUNTS_PER_RPC_CALL = 100;
  const CHUNK_RPC_CALLS = 10;

  const rpcCalls = chunk(accounts, CHUNK_ACCOUNTS_PER_RPC_CALL).map((chunk) => ({
    jsonrpc: '2.0',
    id: 42,
    method: 'getMultipleAccounts',
    params: [ chunk, { encoding } ]
  }));

  const allCalls = [] as any;
  const batches = chunk(rpcCalls, CHUNK_RPC_CALLS);
  for (let i = 0; i < batches.length; i++) {
    const response = await Promise.all(
      batches[i].map((chunk) =>
        rpcRequest(url, chunk)
      )
    );

    allCalls.push(response);
  }

  return chain(allCalls)
    .flatten()
    .map((response) => response ? response.result.value : null)
    .flatten()
    .map((acc, index) => acc ? ({ ...acc, pubkey: accounts[index] }) : null)
    .filter(Boolean)
    .value();
}
