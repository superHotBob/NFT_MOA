require('dotenv').config({path: __dirname + '/.env'})
const Pool = require("pg").Pool;
const pool = new Pool({
  user: "iuevfshp",
  host: "dumbo.db.elephantsql.com",
  database: "iuevfshp",
  password: process.env.DATABASE_PASSWORD,
  port: 5432,
});
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
  const c = req.query.address
  pool.query(
    "SELECT * FROM tokens WHERE address = $3 ORDER BY tokenid ASC LIMIT $1 OFFSET $2", [a,b,c],
    (error, result) => {
      if (error) {
        throw error
      } else {
        res.json(result.rows)
      }
      
    }
   
  );
};
const readOneToken = (req,res) => { 
  const a = req.query.token
  // const b =  req.query.offset 
  pool.query(
    "SELECT * FROM tokens WHERE tokenid = $1", [a],
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
  readSmartContracts,
  readAllTokens,
  readOneToken
};
