const axios = require('axios')



const apiKey = "BDVa7LAfJZLftNoctYU0CJP1IaK8OQKt";
const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${apiKey}/getNFTsForCollection`;
const contractAddr = "0xaAdBA140Ae5e4c8a9eF0Cc86EA3124b446e3E46A";


async function callGetNFTsForCollectionOnce(
    startToken = ""
  ) {
    const url = `${baseURL}/?contractAddress=${contractAddr}&startToken=${startToken}`;
    const response = await axios.get(url);
    console.log(response.data.nfts.length);
    return response.data;
  }

  module.exports = callGetNFTsForCollectionOnce