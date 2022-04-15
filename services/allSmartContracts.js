const axios = require("axios");
require("dotenv").config({ path: __dirname + "/.env" });

const Pool = require("pg").Pool;
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
    callGetNFTsForCollectionOnce(contracts);    
   
  });
};

const apiKey = process.env.API_TOKEN;
const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${apiKey}/getNFTsForCollection`;
const contractAddr = process.env.CONTRACT_ADDRESS
const baseURLTwo = `https://eth-mainnet.alchemyapi.io/v2/${apiKey}/getNFTMetadata`;
const tokenType = "erc721";



let n = 13;
let nn = 0;
async function callGetNFTsForCollectionOnce(a, startToken = "") {
  if (n > 0) {
    const url = `${baseURL}/?contractAddress=${
      a[n-1].address
    }&startToken=${startToken}`;    
    const response = await axios.get(url);
    const allTokensLength = response.data.nfts.map((i) => i.id.tokenId).length;
    // getImageToken(a[n-1].address, tokenId);
    if (response.data.nextToken) {      
      callGetNFTsForCollectionOnce(a, response.data.nextToken);
      nn = nn + allTokensLength;     
      console.log(nn);
    } else {     
      const b = a[n-1].address;
      pool.query(
        "UPDATE smartcontracts SET token_count=$1 WHERE address=$2",
        [nn, b],
        (error, results) => {
          if (error) {
            throw error;
          }
          n = n - 1;
          nn = nn*0;
          callGetNFTsForCollectionOnce(a, startToken = "");
        }
      );
    }
  } else {
    console.log("end");
  }
}

module.exports = readSmartContractsAddress;
