const axios = require("axios");
require("dotenv").config({ path: __dirname + "/.env" });
const Pool = require("pg").Pool;
const pool = new Pool({
  user: "iuevfshp",
  host: "dumbo.db.elephantsql.com",
  database: "iuevfshp",
  password: "ywDJ5rXh3ot6jqjRqw-X83xwzPDQ222c",
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
    callGetNFTsForCollectionOnce(contracts);
    // getImageToken(contracts);
  });
};

const apiKey = process.env.API_TOKEN;
const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${apiKey}/getNFTsForCollection`;
const contractAddr = "0xaAdBA140Ae5e4c8a9eF0Cc86EA3124b446e3E46A";
const baseURLTwo = `https://eth-mainnet.alchemyapi.io/v2/${apiKey}/getNFTMetadata`;
const tokenType = "erc721";

function getImageToken(a, b) {
  const config = {
    method: "get",
    url: `${baseURLTwo}?contractAddress=${a[11].address}&tokenId=${b}&tokenType=${tokenType}`,
    headers: {},
  };
  axios(config)
    .then((response) => {
      const data = response.data;

      const c = data.metadata.image;

      console.log(c);
      pool.query(
        "UPDATE smartcontracts  SET image = $2 WHERE address = $1",
        [a[n - 1].address, c],
        (error, results) => {
          if (error) {
            throw error;
          }
        }
      );
    })
    .catch((error) => console.log(error));
}

let n = 12;
let nn = 0;
async function callGetNFTsForCollectionOnce(a, startToken = "") {
  if (n > 0) {
    const url = `${baseURL}/?contractAddress=${
      a[n - 1].address
    }&startToken=${startToken}`;
    const response = await axios.get(url);
    const tokenId = response.data.nfts[0].id.tokenId;
    getImageToken(a, tokenId);
    if (response.data.nextToken) {
      callGetNFTsForCollectionOnce(a, response.data.nextToken);
      // nn = nn + 100;
      n = n - 1;
      console.log(nn);
    } else {
      console.log(nn);
      const b = a[n - 1].address;

      // pool.query(
      //   "UPDATE smartcontracts SET token_count=$1 WHERE address=$2",
      //   [nn, b],
      //   (error, results) => {
      //     if (error) {
      //       throw error;
      //     }
      //     n = n - 1;
      //     nn = nn*0;
      //     callGetNFTsForCollectionOnce(a, (startToken = ""));

      //   }
      // );
    }
  } else {
    console.log("end");
  }
}

module.exports = readSmartContractsAddress;
