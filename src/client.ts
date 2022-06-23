import { SDKConfigType, Token } from "./types";

export default class Client {
  constructor(private readonly config: SDKConfigType) {}

  public async fetchMint(): Promise<Token> {
    console.log('config', this.config);

    return {} as any;
  }

  public async fetchMints(): Promise<Token[]> {

    return [] as any;
  }

}

