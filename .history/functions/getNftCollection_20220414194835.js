const axios = require("axios");
const fs = require('fs');
require("dotenv").config({ path: __dirname + "/.env" });
const Pool = require("pg").Pool;

const { createAlchemyWeb3 } = require("@alch/alchemy-web3");

const pool = new Pool({
  user: "iuevfshp",
  host: "dumbo.db.elephantsql.com",
  database: "iuevfshp",
  password: process.env.DATABASE_PASSWORD,
  port: 5432,
});

const apiKey = process.env.API_TOKEN;
const web3 = createAlchemyWeb3(
  "https://eth-mainnet.alchemyapi.io/v2/${apiKey}"
);
const baseURLOne = `https://eth-mainnet.alchemyapi.io/v2/${apiKey}/getNFTsForCollection`;

let countTokens = 0;
async function callGetNFTsForCollectionOnce(startToken = "") {   
      const url = `${baseURLOne}/?contractAddress=${contracts.address}&startToken=${startToken}`;
      const response = await axios.get(url);
      const allTokens = response.data.nfts.map((i) => i.id.tokenId);
      totalNftsFound.push(allTokens);
      let nextToken = response.data.nextToken;
      if (nextToken) {
        
      } else {
        m = totalNftsFound.flat().length - 1;
        console.log(`${contracts[n].address}  ':' ${m}`);     
        writeConsole(`${contracts[n].address}  ':' ${m}`)
        writeToBase(contracts[n]);
       
        
      }
   
  }