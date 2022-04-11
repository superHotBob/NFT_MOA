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
const baseURLOne = `https://eth-mainnet.alchemyapi.io/v2/${apiKey}/getNFTsForCollection`;
const contractAddr = "0xaAdBA140Ae5e4c8a9eF0Cc86EA3124b446e3E46A";
const baseURLTwo = `https://eth-mainnet.alchemyapi.io/v2/${apiKey}/getNFTMetadata`;
let n = 12;
const tokenType = "erc721";

async function callGetNFTsForCollectionOnce(a, startToken = "") {
  const url = `${baseURLOne}/?contractAddress=${
    a[n - 1].address
  }&startToken=${startToken}`;
//   const response = await axios.get(url);
//   console.log(response.data.nfts);
  let m = response.data.nfts.map((i) => i.id.tokenId).length;
  writeToBase();
  function writeToBase() {
    if (m > -1) {
      const tokenId = response.data.nfts[m-1].id.tokenId;
      const config = {
        method: "get",
        url: `${baseURLTwo}?contractAddress=${
          a[n - 1].address
        }&tokenId=${tokenId}&tokenType=${tokenType}`,
        headers: {},
      };
      axios(config)
        .then((response) => {
          const data = response.data;
          const b = tokenId;
          const c = data.metadata.name;
          const d = data.media[0].gateway;
          const e = data.metadata;
        
          console.log(a[0], b, c, d, e);
          pool.query(
            "INSERT INTO tokens (address,tokenid,token_name,image,meta_info) VALUES ($1, $2, $3, $4, $5)",
            [a[n - 1].address, b, c, d, e],
            (error, results) => {
              if (error) {
                throw error;
              }
              m = m - 1;
              writeToBase();
              console.log(m)
            }
          );
        })
        .catch((error) => console.log(error));
    } else {
      console.log("end");
    }
  }
 
}
module.exports = readSmartContractsAddress;
