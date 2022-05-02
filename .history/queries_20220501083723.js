require("dotenv").config({ path: __dirname + "/.env" });
const addCountTokens = require("./functions/getNftCollection");
// const writeNftToBase = require('./functions/writeToBaseTokens');
const Pool = require("pg").Pool;
const pool = new Pool({
  user: "iuevfshp",
  host: "dumbo.db.elephantsql.com",
  database: "iuevfshp",
  password: process.env.DATABASE_PASSWORD,
  port: 5432,
});
const readSmartContracts = (req, res) => {
  console.log(req.path);
  const a = req.query.address;
  const b = req.query.name;
  if (a || b) {
    pool.query(
      "SELECT * FROM smartcontracts WHERE address = $1  OR name_collection ILIKE $2 ",
      [a, "%" + b + "%"],
      (error, result) => {
        if (error) {
          throw error;
        } else {
          res.json(result.rows);
        }
      }
    );
  } else {
    pool.query("SELECT * FROM smartcontracts ", (error, result) => {
      if (error) {
        throw error;
      } else {
        res.json(result.rows);
      }
    });
  }
};
const readAllTokens = (req, res) => {
  const a = req.query.limit;
  const b = req.query.offset;
  const c = req.query.address;
  pool.query(
    "SELECT * FROM tokens WHERE address = $3 ORDER BY tokenid ASC LIMIT $1 OFFSET $2",
    [a, b, c],
    (error, result) => {
      if (error) {
        throw error;
      } else {
        res.json(result.rows);
      }
    }
  );
};
const readOneToken = (req, res) => {
  const a = req.query.token;
  const b = req.query.address;
  pool.query(
    "SELECT * FROM tokens WHERE tokenid = $1 AND address = $2",
    [a, b],
    (error, result) => {
      if (error) {
        throw error;
      } else {
        res.json(result.rows);
      }
    }
  );
};
const addCollection = (req, res, next) => {
  const a = req.query.address;
  const b = req.query.collection;
  const c = req.query.doing;
  console.log(a, b, c);
  if (a) {
    if (c === "create") {
      pool.query(
        "INSERT INTO smartcontracts(address, name_collection) VALUES ($1, $2) RETURNING * ",
        [a, b],
        (error, result) => {
          if (error) {
            res.send(
              `<div style="width: 30%;margin: 20vw auto;font-size: 20px">
            <b style="color: red">ERROR:</b> Collection is in base
            </div>`
            );
          } else {
            addCountTokens(a);
            console.log("add count tokens");
            res.send(
              `<div style="width: 30%;margin: 20vw auto;font-size: 20px">
            Collection add to base
            </div>`
            );
          }
        }
      );
    } else if (c === "update") {
      pool.query(
        "DELETE FROM tokens WHERE address = $1",
        [a],
        (error, result) => {
          if (error) {
            res.send(
              `<div style="width: 30%;margin: 20vw auto;font-size: 20px">
              <b style="color: red">ERROR:</b> 
              </div>`
            );
          } else {
            addCountTokens(a);
            res.send(
              `<div style="width: 30%;margin: 20vw auto;font-size: 20px">
              <b style="color: red">The update begining </b> 
              </div>`)
            
          }
        }
      );
    } else {
      pool.query(
        "DELETE FROM tokens WHERE address = $1",
        [a],
        (error, result) => {
          if (error) {
            res.send(
              `<div style="width: 30%;margin: 20vw auto;font-size: 20px">
              <b style="color: red">ERROR:</b> 
              </div>`
            );
          } else {
            res.send(
              `<div style="width: 30%;margin: 20vw auto;font-size: 20px">
              Collection deleted
              </div>`
            );
          }
        }
      );
    }
  } else {
    next();
  }
  
};

module.exports = {
  readSmartContracts,
  readAllTokens,
  readOneToken,
  addCollection,
};
