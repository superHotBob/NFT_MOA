const axios = require("axios");
const fs = require("fs");
require("dotenv").config({ path: __dirname + "/.env" });
const Pool = require("pg").Pool;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const contractABI = require("../artifacts/contracts/NFTMinter.sol/contract-abi.json");


const pool = new Pool({
  user: "iuevfshp",
  host: "dumbo.db.elephantsql.com",
  database: "iuevfshp",
  password: process.env.DATABASE_PASSWORD,
  port: 5432,
});



let contracts = [];
let countContracts = 0;

function findOwner(req, res) {
    ReadIdToken("0xaAdBA140Ae5e4c8a9eF0Cc86EA3124b446e3E46A");
//   pool.query("SELECT address FROM smartcontracts", (error, result) => {
//     if (error) {
//       throw error;
//     } else {
//       contracts = result.rows.map((i) => i.address);
//       writeConsole(contracts.map((i) => i.address).join(" "));

//       //   res.send(
//       //     `<h2 style="margin-top: 20vh;text-align: center;">
//       //     This is begin create base by <br/>
//       //     contracts:<br/> ${contracts.map((i) => i.address).join(",<br/>")}
//       //     </h2>`

//       //   );
//     }

//     countContracts = contracts.length;
//     console.log(contracts);
//     ReadIdToken("0xc92cedDfb8dd984A89fb494c376f9A48b999aAFc");
//   });
};

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
      WriteToBaseOwner(a);

    }
  );
};

let num = 0;
async function WriteToBaseOwner(a) {
  if (tokenId[num] != 'undefined') {
    ReadOwner(a, tokenId[num]);
  } else {
    console.log("Write finished");
  }
};

const apiKey = process.env.API_TOKEN;
const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${apiKey}/getOwnersForToken`;
const web3 = createAlchemyWeb3(
  "https://eth-mainnet.alchemyapi.io/v2/${apiKey}"
);

async function ReadOwner(address, b) {
  const price = (Math.random() * 10).toFixed(2);
  console.log("Token", b, price);
  const config = {
    method: "get",
    url: `${baseURL}?contractAddress=${address}&tokenId=${b}`,
    headers: {},
  };
  axios(config)
    .then((response) => {
      pool.query(
        "UPDATE tokens SET owner = $1 , current_price = $2 WHERE address = $3",
        [response.data.owners[0], price, address],
        (error, results) => {
          if (error) {
            throw error;
          }
         console.log(price); 
         num = num + 1;
         WriteToBaseOwner(address);
        }
      );
    })
    .catch((error) => console.log(error));
};




const baseURLOne = `https://eth-mainnet.alchemyapi.io/v2/${apiKey}/getNFTsForCollection`;
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
function writeConsole(a) {
    fs.appendFile("data.txt", `${a}<br/>`, "utf8", function (err) {
      if (err) throw err;
    });
};


module.exports = findOwner;
