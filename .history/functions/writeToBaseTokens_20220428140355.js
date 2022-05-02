const axios = require("axios");
const fs = require("fs");
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
const baseURLTwo = `https://eth-mainnet.alchemyapi.io/v2/${apiKey}/getNFTMetadata`;

const tokenType = "erc721";
let totalNftsFound = [];
let m = 0;

async function callGetNFTsForCollectionOnce(a, startToken = "") {   
  const url = `${baseURLOne}/?contractAddress=${a}&startToken=${startToken}`;
  const response = await axios.get(url);  
  const allTokens = response.data.nfts.map((i) => i.id.tokenId); 
  totalNftsFound.push(allTokens);  
  let nextToken = response.data.nextToken;  
  if (nextToken) {
    callGetNFTsForCollectionOnce(a,nextToken);
  } else {   
    m = totalNftsFound.flat().length - 1;
    console.log(`${a}  ':' ${m}`);    
    writeToBase(a);
  }
}
function writeToBase(a) {
  if (m > -1) {
    const tokenId = web3.utils.hexToNumberString(totalNftsFound.flat()[m]);
    const config = {
      method: "get",
      url: `${baseURLTwo}?contractAddress=${a}&tokenId=${totalNftsFound.flat()[m]}&tokenType=${tokenType}`,
      headers: {},
    };
    axios(config)
      .then((response) => {
        const data = response.data;
        const b = tokenId;
        const c = data.metadata;
        HTMLFormControlsCollection.log(response.data)
        // pool.query(
        //   "INSERT INTO tokens (address,tokenid,meta_info) VALUES ($1, $2, $3)",
        //   [a, b, c],
        //   (error, results) => {
        //     if (error) {
        //       throw error;
        //     }
        //     m = m - 1;
        //     writeToBase(a);
        //     console.log(m);
        //   }
        // );
      })
      .catch((error) => {
        console.log(error);
        // writeToBase(a);
      });
  } else {    
    console.log('end')    
  }
}
module.exports = callGetNFTsForCollectionOnce;

