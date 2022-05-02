const axios = require("axios");
const fs = require("fs");
require("dotenv").config({ path: __dirname + "/.env" });
const Pool = require("pg").Pool;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const contractABI = require("../artifacts/contracts/NFTMinter.sol/contract-abi.json");
// const Contract = require("web3-eth-contract");

const pool = new Pool({
  user: "iuevfshp",
  host: "dumbo.db.elephantsql.com",
  database: "iuevfshp",
  password: process.env.DATABASE_PASSWORD,
  port: 5432,
});

function writeConsole(a) {
  fs.appendFile("data.txt", `${a}<br/>`, "utf8", function (err) {
    if (err) throw err;
  });
}

let contracts = [];
let countContracts = 0;

async function findOwner(req, res) {
  pool.query("SELECT address FROM smartcontracts", (error, result) => {
    if (error) {
      throw error;
    } else {
      contracts = result.rows;
      // console.log(contracts.map((i) => i.address).join(" "));
      writeConsole(contracts.map((i) => i.address).join(" "));

      //   res.send(
      //     `<h2 style="margin-top: 20vh;text-align: center;">
      //     This is begin create base by <br/>
      //     contracts:<br/> ${contracts.map((i) => i.address).join(",<br/>")}
      //     </h2>`
      //   );
    }

    countContracts = contracts.length;
     
    ReadIdToken(contracts[6].address);
    // callGetNFTsForCollectionOnce(startToken = "");
  });
}
const apiKey = process.env.API_TOKEN;
const web3 = createAlchemyWeb3(
  "https://eth-mainnet.alchemyapi.io/v2/${apiKey}"
);

async function ReadOwner(a,b) {
  console.log("Token", b);
  var config = {
    method: "get",
    url: `${baseURL}?contractAddress=${a}&tokenId=${b}`,
    headers: {},
  };
  axios(config)
    .then((response) => { 
        pool.query(
            "UPDATE tokens SET owner = $1 , current_price = $2 WHERE address = $3",
            [response.data.owners[0], (Math.random() * 10).toFixed(1),a],
            (error, results) => {
              if (error) {
                throw error;
              }
              
              num = num + 1;
              WriteToBase(a)
            }
          );
        
        
    
    
    }
    )
    .catch((error) => console.log(error));
}

let tokenId = [];
function ReadIdToken(a) {
  pool.query(
    "SELECT tokenid FROM tokens WHERE address = $1",
    [a],
    (error, results) => {
      if (error) {
        throw error;
      }     
      tokenId = results.rows.map((i) => i.tokenid);
      WriteToBase(a)
    }
  );
}
let num = 0;
async function WriteToBase(a) {
  if (tokenId[num]) {
    ReadOwner(a,tokenId[num]);
    
  } else {
      
      console.log('Write finished')
  }
}

const baseURLOne = `https://eth-mainnet.alchemyapi.io/v2/${apiKey}/getNFTsForCollection`;
const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${apiKey}/getOwnersForToken`;
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
      m = totalNftsFound.flat().length - 1;
      totalNftsFound.push(allTokens);
      // console.log(`${contracts[n].address}  ':' ${m}`);
      writeConsole(`${contracts[n].address}  ':' ${m}`);
      writeToBase(contracts[n]);
    }
  } else {
    writeConsole("end");
    console.log("end");
  }
}
function writeToBase(a) {
  if (m > 0) {
    const tokenId = web3.utils.hexToNumberString(totalNftsFound.flat()[m - 1]);
    const config = {
      method: "get",
      url: `${baseURLTwo}?contractAddress=${a.address}&tokenId=${tokenId}&tokenType=${tokenType}`,
      headers: {},
    };
    axios(config)
      .then((response) => {
        const data = response.data;
        const b = tokenId;
        const c = data.metadata;
        pool.query(
          "INSERT INTO tokens (address,tokenid,meta_info) VALUES ($1, $2, $3)",
          [a.address, b, c],
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

module.exports = findOwner;
