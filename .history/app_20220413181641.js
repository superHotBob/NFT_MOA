const cors = require('cors')
const fs = require('fs');
const bodyParser = require('body-parser')
const express = require('express')
const db = require('./queries')
const allSmartContracts = require('./services/allSmartContracts')
const allTokens = require('./services/allTokens')


const app = express()

const auth = require('./middleware/auth')
app.use(require('express-status-monitor')())
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
// allTokens()
// allSmartContracts()

app.get('/api/addcontract', (req,res) =>{
  res.send(

    `<div style="width: 40%;margin: 30px auto">
    <form>
    <label>
    <input type='text' placeholder='smartcontract name' />
    </label>
    <label>
    <input type='text' placeholder='collection name' />
    </label>
    </form>
    </div>`
  )
})

app.get('/api/collections', db.readSmartContracts, (req, res) => { 
  res.status(200).json(token)
})
app.get('/api/tokens', db.readAllTokens, (req, res) => {  
  res.status(200).json(JSON.parse(token))
})
app.get('/api/token', db.readOneToken, (req, res) => {  
  res.status(200).json(JSON.parse(token))
})
app.get('/api/createbase' , auth, allTokens, (req, res) => {
  res.status(200).send(
    '<h1 style="margin-top: 40vh;text-align: center;">Base begining created</h1>')
})
app.get('/api/console' , (req, res) => {
  fs.readFile('data.txt', function(err, data) {
    res.status(200).send(
      `<p style="margin-top: 40vh;text-align: center;">${data}</p>`)
  });
})

app.get('/test_server', auth, (req, res) => {
  res.send(
    '<h1 style="margin-top: 40vh;text-align: center;">This is test server request</h1>'
  )
})

module.exports = app
