const Pool = require("pg").Pool;
const pool = new Pool({
  user: "iuevfshp",
  host: "dumbo.db.elephantsql.com",
  database: "iuevfshp",
  password: "ywDJ5rXh3ot6jqjRqw-X83xwzPDQ222c",
  port: 5432,
});

const writeActivity = (a, b, c) => {
  console.log(a, b, c);
  pool.query(
    "INSERT INTO home (author, newuser, tokenid) VALUES ($1,$2,$3)",
    [a, b, c],
    (error, results) => {
      if (error) {
        throw error;
      }
    }
  );
};
const writeMinting = (a, b, c, d, e) => {
  console.log(a, b, c, d, e);
  pool.query(
    "INSERT INTO tokens  VALUES ($1, $2, $3 , $4 ,$5 )",
    [a, b, c, d, e],
    (error, results) => {
      if (error) {
        throw error;
      }
    }
  );
};
const readSmartContracts = () => {
  pool.query(
    "SELECT FROM smartcontracts", 
    (error, result) => {
      if (error) {
        throw error
      }
    }
  );
};

module.exports = {
  writeActivity,
  writeMinting,
  readSmartContracts
};
