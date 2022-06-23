import { PublicKey } from "@solana/web3.js";

interface keysMapType {
  [key: string]: boolean
}

export const publicKeysToMap = (keys: PublicKey[]): keysMapType => {
  return keys.reduce((acc, cur) => {
    acc[cur.toString()] = true;
    return acc;
  }, {})
}
