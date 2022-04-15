const cors = require("cors");
const fs = require("fs");
const bodyParser = require("body-parser");
const express = require("express");
const db = require("./queries");
const allSmartContracts = require("./services/allSmartContracts");
const allTokens = require("./services/allTokens");


const app = express();

const auth = require("./middleware/auth");
app.use(require("express-status-monitor")());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// allTokens()
// allSmartContracts()

app.get("/api/addnewcontract", db.addCollection, (req, res) => {
 
  res.send(
    `<div style="width: 30%;margin: 20vw auto;font-size: 20px">
    <form method="get" action='/api/addnewcontract'>
    <label>
    <input 
      type='text'
      required
      patern="^0x[0-9a-fA-F]{40}$"
      name='address' 
      placeholder='smartcontract name' 
      style="padding: 20;
        width: 100%;
        margin: 30px auto;font-size: 20px;"
    />
    </label>
    <label>
    <input 
    type='text'
    required
    name='collection'
    placeholder='collection name' 
    style="padding: 20;
      width: 100%;
      margin: 30px auto;font-size: 20px;"
    />
    </label>
    <button type='submit' style="font-size: 20px;padding: 20;width: 100%;margin: 30px auto">add collection </button>
    </form>
    </div>`
  );
});

app.get("/api/getcollections", db.readSmartContracts, (req, res) => {
  res.status(200).json(token);
});
app.get("/api/getalltokens", db.readAllTokens, (req, res) => {
  res.status(200).json(JSON.parse(token));
});
app.get("/api/getonetoken", db.readOneToken, (req, res) => {
  res.status(200).json(JSON.parse(token));
});
app.get("/api/createbase", auth, allTokens, (req, res) => {
  res
    .status(200)
    .send(
      '<h1 style="margin-top: 40vh;text-align: center;">Base begining created</h1>'
    );
});
app.get("/api/console", (req, res) => {
  fs.readFile("data.txt", function (err, data) {
    res
      .status(200)
      .send(`<p style="margin-top: 40vh;text-align: center;">${data}</p>`);
  });
});

app.get("/test_server", auth, (req, res) => {
  res.send(
    '<h1 style="margin-top: 40vh;text-align: center;">This is test server request</h1>'
  );
});

module.exports = app;
