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
const readSmartContracts = async () => {
  pool.query("SELECT address FROM smartcontracts", (error, result) => {
    if (error) {
      throw error;
    } else {
     contracts = result.rows
     
      
    }
    console.log(contracts[1].address)
    callGetNFTsForCollectionOnce(contracts)
  });
  pool.end() 
  


const apiKey = "BDVa7LAfJZLftNoctYU0CJP1IaK8OQKt";
const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${apiKey}/getNFTsForCollection`;
const contractAddr = "0xaAdBA140Ae5e4c8a9eF0Cc86EA3124b446e3E46A";
let n = 12
console.log(n)
async function callGetNFTsForCollectionOnce(a, startToken = "") {
    console.log(a)
  if(n>0){  
    const url = `${baseURL}/?contractAddress=${a[n].address}&startToken=${startToken}`;
    const response = await axios.get(url);
    const m = response.data.nfts.length;
    const b = a[n].address;
    console.log(`${b} :${m}` )
    pool.query(
        "UPDATE smartcontracts SET token_count=$1 WHERE address=$2",
        [m, b],
        (error, results) => {
        if (error) {
            throw error;
        }
           n = n-1
           console.log(n),
            callGetNFTsForCollectionOnce(a, startToken = '')
        },
       
        pool.end()
    );
    } else {
         return  console.log('end');
    }
  
}
}
module.exports = readSmartContracts;
