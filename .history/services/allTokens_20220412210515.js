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


function writeConsole (a) {
  fs.appendFile('data.txt', `dfgdgdfgd <br/>`, 'utf8', function (err) {
    if (err) throw err
  })
}

let contracts = [];
const readSmartContractsAddress = async (req, res) => {
  pool.query("SELECT address FROM smartcontracts", (error, result) => {
    if (error) {
      throw error;
    } else {
      contracts = result.rows;
      console.log(contracts.map((i) => i.address).join(" "));
      writeConsole(contracts.map((i) => i.address).join(" "));
      res.send(
        `<h2 style="margin-top: 20vh;text-align: center;">
        This is begin create base by <br/> 
        contracts:<br/> ${contracts.map((i) => i.address).join(",<br/>")}
        </h2>`
      );
    }
    // callGetNFTsForCollectionOnce(startToken = "");
  });
};

const apiKey = process.env.API_TOKEN;
const web3 = createAlchemyWeb3(
  "https://eth-mainnet.alchemyapi.io/v2/${apiKey}"
);
const baseURLOne = `https://eth-mainnet.alchemyapi.io/v2/${apiKey}/getNFTsForCollection`;
const contractAddr = "0xaAdBA140Ae5e4c8a9eF0Cc86EA3124b446e3E46A";
const baseURLTwo = `https://eth-mainnet.alchemyapi.io/v2/${apiKey}/getNFTMetadata`;

const tokenType = "erc721";
let totalNftsFound = [];
let m = 0;
let n = 12;

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
      m = totalNftsFound.flat().length;
      console.log(`${contracts[n].address}  ':' ${m}`);     
      
     writeToBase(contracts);
      
    }
  } else {
    console.log('end');
    
  }
}
function writeToBase(a) {
  if (m > 0) {
    const tokenId = web3.utils.hexToNumberString(totalNftsFound.flat()[m - 1]);
    const config = {
      method: "get",
      url: `${baseURLTwo}?contractAddress=${a[n].address}&tokenId=${tokenId}&tokenType=${tokenType}`,
      headers: {},
    };
    axios(config)
      .then((response) => {
        const data = response.data;
        const b = tokenId;
        const c = data.metadata;
        pool.query(
          "INSERT INTO tokens2 (address,tokenid,meta_info) VALUES ($1, $2, $3)",
          [a[1].address, b, c],
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
    n = n - 1
    totalNftsFound = [];
    callGetNFTsForCollectionOnce(startToken = "")
  }
}


// if ( response.data.nextToken) {

//  totalNftsFound += response.data.nfts.length;
//  callGetNFTsForCollectionOnce(a, response.data.nextToken)
// } else {
//   console.log(totalNftsFound)
// }

// while (hasNextPage) {
//   const { nfts, nextToken } = await callGetNFTsForCollectionOnce(
//     startToken
//   );
//   if (!nextToken) {
//     // When nextToken is not present, then there are no more NFTs to fetch.
//     hasNextPage = false;
//   }
//   startToken = nextToken;
//   totalNftsFound += nfts.length;
// }

// async function callGetNFTsForCollectionOnce(a, startToken = "") {
//   const url = `${baseURLOne}/?contractAddress=${
//     a[n - 1].address
//   }&startToken=${startToken}`;
//   const response = await axios.get(url);
//  console.log(response.data.nfts);

//   // writeToBase();

module.exports = readSmartContractsAddress;
