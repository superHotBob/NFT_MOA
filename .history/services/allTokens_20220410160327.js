const axios = require("axios");
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
  });
};

const apiKey = "BDVa7LAfJZLftNoctYU0CJP1IaK8OQKt";
const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${apiKey}/getNFTsForCollection`;
const contractAddr = "0xaAdBA140Ae5e4c8a9eF0Cc86EA3124b446e3E46A";

let n = 12;

async function callGetNFTsForCollectionOnce(a, startToken = "0") {
  if (n > 0) {
    const url = `${baseURL}/?contractAddress=${
      a[n - 1].address
    }&startToken=${startToken}`;
    const response = await axios.get(url);
    const m = response.data.nfts.length;
    const b = a[n - 1].address;
    console.log(`${b} :${m}`);
    pool.query(
      "UPDATE smartcontracts SET token_count=$1 WHERE address=$2",
      [m, b],
      (error, results) => {
        if (error) {
          throw error;
        }
        n = n - 1;
        callGetNFTsForCollectionOnce(a, (startToken = ""));
      }
    );
  } else {
    return console.log("end");
  }
}

module.exports = readSmartContractsAddress;
