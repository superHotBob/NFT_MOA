const cors = require('cors')
const bodyParser = require('body-parser')
const express = require('express')
const db = require('./queries')
const activity = require('./services/activity')
const allSmartContracts = require('./services/allSmartContracts')
const allTokens = require('./services/allTokens')


const app = express()

// Const auth = require('./middleware/auth')

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
allTokens()
// setInterval(() => activity(), 600000)

app.post('/api/minting', db.writeMinting, (req, res) => {})
app.get('/api/smartcontracts', db.readSmartContracts, (req, res) => {
  console.log(res)
  res.status(200).json(token)
})
// app.get('/api/transactions', db.transactions, (req, res) => {})
// app.post('/api/login', db.updateUser, async (req, res) => {
//   // Our login logic starts here
//   try {
//     // Get user input
//     const { walletAddress } = req.body

//     // Validate user input
//     if (!walletAddress) {
//       res.status(400).send('All input is required')
//     }

//     if (walletAddress) {
//       const token = jwt.sign(
//         { walletAddress },
//         '09f26e402586e2faa8da4c98a35f1b20d6b033c60',
//         { expiresIn: '10m' }
//       )
//       res.status(200).json(token)
//     }
//   } catch (err) {
//     console.log(err)
//   }
//   // Our register logic ends here
// })

app.get('/test_server', (req, res) => {
  res.send(
    '<h1 style="margin-top: 40vh;text-align: center;">This is Oasis node server</h1>'
  )
})

module.exports = app
