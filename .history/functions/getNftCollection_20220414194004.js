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

async function callGetNFTsForCollectionOnce(startToken = "") {
    if (n > -1) {
      const url = `${baseURLOne}/?contractAddress=${contracts[n].address}&startToken=${startToken}`;
      const response = await axios.get(url);
      const allTokens = response.data.nfts.map((i) => i.id.tokenId);
      totalNftsFound.push(allTokens);
      let nextToken = response.data.nextToken;
      if (nextToken) {
        callGetNFTsForCollectionOnce(nextToken);
      } else {
        m = totalNftsFound.flat().length - 1;
        // console.log(`${contracts[n].address}  ':' ${m}`);     
        writeConsole(`${contracts[n].address}  ':' ${m}`)
        writeToBase(contracts[n]);
       
        
      }
    } else {
      writeConsole('end');
      console.log('end');
      
    }
  }