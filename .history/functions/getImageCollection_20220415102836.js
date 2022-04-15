const axios = require("axios");
require("dotenv").config({ path: __dirname + "/.env" });
const writeNftToBase = require('../functions/writeToBaseTokens');
const Pool = require("pg").Pool;
const pool = new Pool({
  user: "iuevfshp",
  host: "dumbo.db.elephantsql.com",
  database: "iuevfshp",
  password: process.env.DATABASE_PASSWORD,
  port: 5432,
});

const tokenType = "erc721";
const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${process.env.API_TOKEN}/getNFTMetadata`;

function getImageToken(a, b) {
  const config = {
    method: "get",
    url: `${baseURL}?contractAddress=${a}&tokenId=${b}&tokenType=${tokenType}`,
    headers: {},
  };
  axios(config)
    .then((response) => {
      const data = response.data;
      const c = data.metadata.image;
      console.log(c);
      pool.query(
        "UPDATE smartcontracts  SET image = $2 WHERE address = $1 RETURNING *",
        [a, c],
        (error, result) => {
          if (error) {
            throw error;
          } else {
            console.log(result.rows)
            writeNftToBase(a)
          }
        }
      );
    })
    .catch((error) => console.log(error));
}
module.exports = getImageToken;
