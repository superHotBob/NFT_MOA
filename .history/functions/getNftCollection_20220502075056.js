const axios = require("axios");
const fs = require('fs');
require("dotenv").config({ path: __dirname + "/.env" });
const Pool = require("pg").Pool;
const writeImageToBase = require('../functions/getImageCollection');

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
const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${apiKey}/getNFTsForCollection`;

let totalNftsFound = 0;
async function callGetNFTsForCollectionOnce(a,startToken = "") {   
      const url = `${baseURL}/?contractAddress=${a}&startToken=${startToken}`;
      const response = await axios.get(url);
      const allTokens = response.data.nfts.map((i) => i.id.tokenId);
      let firstTokenId = 0;
      if(totalNftsFound) {firstTokenId = allTokens[0]}   
      let nextToken = response.data.nextToken;
      if (nextToken) {
        totalNftsFound = totalNftsFound + allTokens.length  
        console.log('Total NFT found',totalNftsFound)  
        callGetNFTsForCollectionOnce(a,nextToken)
      } else {
        totalNftsFound = totalNftsFound + allTokens.length        
        console.log(`${a}  ':' ${totalNftsFound}`);
        pool.query(
            "UPDATE smartcontracts SET token_count = $1 WHERE address = $2 ",
            [totalNftsFound, a], 
            (error, result) => {
              if (error) {
                throw error
              } else {
                console.log('Write to base',result.rows)
                writeImageToBase(a,firstTokenId)
              }      
            }   
          );
        
      }
   
  }
  module.exports = callGetNFTsForCollectionOnce;
