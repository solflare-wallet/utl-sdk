import { Connection } from "@solana/web3.js";

export enum Tag {
  LP_TOKEN = 'lp-token',
}

export interface SDKConfigType {
  connection?: Connection,
  apiUrl?: string,
  cdnUrl?: string
}

export interface Token {
  name: string
  symbol: string
  logoURI: string | null
  verified: boolean
  address: string
  tags: Set<Tag>
  decimals: number | null
  holders: number | null
}
