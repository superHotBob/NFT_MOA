require('dotenv').config({path: __dirname + '/.env'})
const Pool = require("pg").Pool;
const pool = new Pool({
  user: "iuevfshp",
  host: "dumbo.db.elephantsql.com",
  database: "iuevfshp",
  password: process.env.DATABASE_PASSWORD,
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
const readSmartContracts = (req,res) => { 
  const a = req.query.address
  const b =  req.query.name 
  if (a || b) {
  pool.query(
    "SELECT * FROM smartcontracts WHERE address = $1  OR name_collection ILIKE $2 ",[a, '%' + b + '%'], 
    (error, result) => {
      if (error) {
        throw error
      } else {
        res.json(result.rows)
      }      
    }   
  );
} else {
  pool.query(
    "SELECT * FROM smartcontracts ",
    (error, result) => {
      if (error) {
        throw error
      } else {
        res.json(result.rows)
      }      
    }   
  );
  }
};
const readAllTokens = (req,res) => { 
  const a = req.query.limit
  const b =  req.query.offset 
  pool.query(
    "SELECT * FROM tokens ORDER BY tokenid ASC LIMIT $1 OFFSET $2", [a,b],
    (error, result) => {
      if (error) {
        throw error
      } else {
        res.json(result.rows)
      }
      
    }
   
  );
};

module.exports = {
  writeActivity,
  writeMinting,
  readSmartContracts,
  readAllTokens
};
