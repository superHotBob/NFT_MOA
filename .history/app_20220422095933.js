const cors = require("cors");
const fs = require("fs");
const bodyParser = require("body-parser");
const express = require("express");
const db = require("./queries");
const allSmartContracts = require("./services/allSmartContracts");
const allTokens = require("./services/allTokens");
const app = express();
app.set('view engine', 'pug');
var router = express.Router()

const auth = require("./middleware/auth");
const my_request = require("./controllers/404");
app.use(require("express-status-monitor")());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// allTokens()
// allSmartContracts()

app.get("/api/addnewcontract",auth, db.addCollection, (req, res) => {
 
  res.send(
    `<div style="width: 35%;margin: 20vw auto;font-size: 23px">
    <form method="get" action='/api/addnewcontract'>
    <input type="radio" id="create" checked 
    style="width:30px;height: 30px; vertical-align: sub"
     name="doing" value="create">
    <label for="create">Create collection</label>

    <input type="radio" id="update" 
    style="width:30px;height: 30px; vertical-align: sub"
     name="doing" value="update">
    <label for="contactChoice2">Update collection</label>

    <input type="radio" id="delete" 
    style="width:30px;height: 30px; vertical-align: sub"
     name="doing" value="delete">
    <label for="delete">Delete collection</label>
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
    <label>
    <input 
      type='text'
      required
      pattern="^0x[0-9a-fA-F]{40}$"
      name='address' 
      placeholder='smartcontract address' 
      style="padding: 20;
        width: 100%;
        margin: 30px auto;font-size: 20px;"
    />
    </label>
   
    <input 
    type='password'
    required
    name='password'
    placeholder='enter password' 
    style="padding: 20;
      width: 100%;
      margin: 30px auto;font-size: 20px;"
    />
    
    <button type='submit' style="font-size: 20px;padding: 20;width: 100%;margin: 30px auto">SUBMIT </button>
    </form>
    </div>`
  );
});
// function writeConsole (a) {
//   fs.appendFile('data.txt', `Request from ${req.url} + new Date(Date.now()<br/>`, 'utf8', function (err) {
//     if (err) throw err
//   })
// }
app.use((req, res, next) => {
  const new_time = new Date(Date.now())
  fs.appendFile('data.txt', `<p>${req.url}:${new_time}</p>\r\n`, 'utf8', function (err) {
    if (err) throw err
  })  
  next();
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

app.get('/', function (req, res) {
  res.render('index', { title: 'My server', message: 'Hello My Friend!'});
});

app.get('*', (req, res) => {
  res.send(`<h1 style="margin-top: 40vh;text-align: center;">
  404! This is an invalid URL.</h1>`);
});
app.route('*')
       .get(my_request.get_404);

module.exports = app;
