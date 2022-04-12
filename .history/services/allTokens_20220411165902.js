const axios = require("axios");
require('dotenv').config({path: __dirname + '/.env'})
const Pool = require("pg").Pool;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");

const pool = new Pool({
  user: "iuevfshp",
  host: "dumbo.db.elephantsql.com",
  database: "iuevfshp",
  password: process.env.DATABASE_PASSWORD,
  port: 5432,
});

let contracts = [];
const readSmartContractsAddress = async () => {
  pool.query("SELECT address FROM smartcontracts", (error, result) => {
    if (error) {
      throw error;
    } else {
      contracts = result.rows;
    }
    // callGetNFTsForCollectionOnce(contracts);
    count(contracts);
  });
};

const apiKey = process.env.API_TOKEN;
const web3 = createAlchemyWeb3("https://eth-mainnet.alchemyapi.io/v2/${apiKey}");
const baseURLOne = `https://eth-mainnet.alchemyapi.io/v2/${apiKey}/getNFTsForCollection`;
const contractAddr = "0xaAdBA140Ae5e4c8a9eF0Cc86EA3124b446e3E46A";
const baseURLTwo = `https://eth-mainnet.alchemyapi.io/v2/${apiKey}/getNFTMetadata`;
let n = 12;

const tokenType = "erc721";

async function callGetNFTsForCollectionOnce(a,
  startToken = ""
) {
  console.log(a);
  const url = `${baseURLOne}/?contractAddress=${a[0].address}&startToken=${startToken}`;
  const response = await axios.get(url);
  if ( response.data.next) {
    console.log(response.data.nfts.length);
  return totalNftsFound += response.data.nfts.length;
  } else {
    hasNextPage = false
  }
  
}
function count(a) {
 
  let hasNextPage = true;
  totalNftsFound = 0;
   if(hasNextPage) {
    callGetNFTsForCollectionOnce(a, startToken = '') 
   } else {
    console.log(totalNftsFound)
   }

}
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
//   let m = response.data.nfts.map((i) => i.id.tokenId).length;
//   // writeToBase();
//   function writeToBase() {
//     if (m > 0) {
//       const tokenId = web3.utils.hexToNumberString(response.data.nfts[m-1].id.tokenId);
//       const config = {
//         method: "get",
//         url: `${baseURLTwo}?contractAddress=${
//           a[n - 1].address
//         }&tokenId=${tokenId}&tokenType=${tokenType}`,
//         headers: {},
//       };
//       axios(config)
//         .then((response) => {
//           const data = response.data;
//           const b = tokenId;        
//           const c = JSON.stringify(data.metadata);        
//           console.log(b);
//           pool.query(
//             "INSERT INTO tokens (address,tokenid,meta_info) VALUES ($1, $2, $3)",
//             [a[n - 1].address, b, c],
//             (error, results) => {
//               if (error) {
//                 throw error;
//               }
//               m = m - 1;
//               writeToBase();
//               console.log(m)
//             }
//           );
//         })
//         .catch((error) => console.log(error));
//     } else {
//       console.log("end");
//     }
//   }
 
// }
module.exports = readSmartContractsAddress;
