const { Client, SDKConfig } = require('..');
const { Connection, PublicKey } = require('@solana/web3.js');

const config = new SDKConfig({
  chainId: 101,
  connection: new Connection('https://api.mainnet-beta.solana.com/'),
  // timeout: 2000,
  // apiUrl: "https://utl-api-dev-vl2y2.ondigitalocean.app",
  // cdnUrl: "https://cdn.jsdelivr.net/gh/solflare-wallet/token-list/solana-tokenlist.json"
});

const mintsToFetch = [
  new PublicKey("So11111111111111111111111111111111111111112"),
  new PublicKey("SLRSSpSLUTP7okbCUBYStWCo1vUgyt775faPqz8HUMr"),
  new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"),
  new PublicKey("MEANeD3XDdUmNMsRGjASkSWdC8prLYsoRJ61pPeHctD"),
  new PublicKey("ATLASXmbPQxBUYbxPsV97usA3fPQYEqzQBUHgiFCUsXx"),
  new PublicKey("SLNDpmoWTVADgEdndyvWzroNL7zSi1dF9PC3xHGtPwp"),
  new PublicKey("5KV2W2XPdSo97wQWcuAVi6G4PaCoieg4Lhhi61PAMaMJ"),
  new PublicKey("4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R"),
  new PublicKey("EP51bskkbQHnKfZEcyopZhaaJNsqDrsski4QATNdikqy"), // Turshijin token
  new PublicKey("FjWWxNDB2uVjeaKR7nVjFjxTau85wVfAzwbLbpmJot3v") // Fake USDC
];

(async () => {
  const tokenListClient = new Client(config);

  const singleToken = await tokenListClient.fetchMint(mintsToFetch[0]);
  console.log('singleToken', singleToken);

  const multipleTokens = await tokenListClient.fetchMints(mintsToFetch);
  console.log("multipleTokens", multipleTokens);
})()
