const axios = require('axios')
const Pool = require("pg").Pool;
const pool = new Pool({
  user: "iuevfshp",
  host: "dumbo.db.elephantsql.com",
  database: "iuevfshp",
  password: "ywDJ5rXh3ot6jqjRqw-X83xwzPDQ222c",
  port: 5432,
});


const readSmartContracts = async (req,res) => { 
    pool.query(
      "SELECT * FROM smartcontracts", 
      (error, result) => {
        if (error) {
          throw error
        } else {
         return result.rows.map(i=>i.address)
        }
        
      }
     
    );
  };



const apiKey = "BDVa7LAfJZLftNoctYU0CJP1IaK8OQKt";
const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${apiKey}/getNFTsForCollection`;
const contractAddr = "0xaAdBA140Ae5e4c8a9eF0Cc86EA3124b446e3E46A";


async function callGetNFTsForCollectionOnce(
    startToken = ""
  ) {
    let smart =  readSmartContracts();
    console.log(smart)  
    const url = `${baseURL}/?contractAddress=${contractAddr}&startToken=${startToken}`;
    const response = await axios.get(url);
    console.log(response.data.nfts.length);
    return response.data.nfts.length;
  }

  module.exports = callGetNFTsForCollectionOnce