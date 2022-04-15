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
    console.log(a)
  const url = `${baseURLOne}/?contractAddress=${a}&startToken=${startToken}`;
  const response = await axios.get(url);
  console.log(response.data)
  const allTokens = response.data.nfts.map((i) => i.id.tokenId);
  totalNftsFound.push(allTokens);
  let nextToken = response.data.nextToken;
  if (nextToken) {
    callGetNFTsForCollectionOnce(nextToken);
  } else {
    totalNftsFound.push(allTokens);
    m = totalNftsFound.flat().length - 1;
    console.log(`${a}  ':' ${m}`);
    // writeToBase(a);
  }
}
function writeToBase(a) {
  if (m > 0) {
    const tokenId = web3.utils.hexToNumberString(totalNftsFound.flat()[m - 1]);
    const config = {
      method: "get",
      url: `${baseURLTwo}?contractAddress=${a}&tokenId=${tokenId}&tokenType=${tokenType}`,
      headers: {},
    };
    axios(config)
      .then((response) => {
        const data = response.data;
        const b = tokenId;
        const c = data.metadata;
        pool.query(
          "INSERT INTO tokens2 (address,tokenid,meta_info) VALUES ($1, $2, $3)",
          [a, b, c],
          (error, results) => {
            if (error) {
              throw error;
            }
            m = m - 1;
            writeToBase(a);
            console.log(m);
          }
        );
      })
      .catch((error) => {
        console.log(error);
        writeToBase(a);
      });
  } else {
    n = n - 1;
    // console.log(n)
    totalNftsFound = [];
    callGetNFTsForCollectionOnce((startToken = ""), n);
  }
}
module.exports = callGetNFTsForCollectionOnce;
