const { Client } = require('..');
const { Connection } = require('@solana/web3.js');

const connection = new Connection('https://mainnet-beta.solflare.network/', 'confirmed');

const config = {
  connection,
  // apiUrl: "https://utl.example.com/api",
  // cdnUrl: "https://cdn.example.com/tokens.json"
};

(async () => {
  const tokenListClient = new Client(config);

  const wrappedSolMint = await tokenListClient.fetchMint("So11111111111111111111111111111111111111112");

  console.log('wrappedSolMint', wrappedSolMint);
})()
