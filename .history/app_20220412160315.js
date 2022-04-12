const cors = require('cors')
const bodyParser = require('body-parser')
const express = require('express')
const db = require('./queries')
const allSmartContracts = require('./services/allSmartContracts')
const allTokens = require('./services/allTokens')


const app = express()

const auth = require('./middleware/auth')

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
// allTokens()
// allSmartContracts()



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


app.get('/test_server', auth, (req, res) => {
  res.send(
    '<h1 style="margin-top: 40vh;text-align: center;">This is test server request</h1>'
  )
})

module.exports = app
