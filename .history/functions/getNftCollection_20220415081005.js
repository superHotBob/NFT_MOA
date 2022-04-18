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

let totalNftsFound = 0;
async function callGetNFTsForCollectionOnce(a,startToken = "") {   
      const url = `${baseURLOne}/?contractAddress=${a}&startToken=${startToken}`;
      const response = await axios.get(url);
      const allTokens = response.data.nfts.map((i) => i.id.tokenId);     
      let nextToken = response.data.nextToken;
      if (nextToken) {
        console.log(totalNftsFound)  
        callGetNFTsForCollectionOnce(a,nextToken)
      } else {
        m = totalNftsFound.length-1;
        console.log(`${a}  ':' ${m}`);
        
      }
   
  }
  module.exports = callGetNFTsForCollectionOnce;