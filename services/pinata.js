const axios = require('axios');

module.exports = async function testAuthentication () {
  const url = `https://api.pinata.cloud/data/testAuthentication`
  return axios
    .get(url, {
      headers: {
        pinata_api_key: '8e18148843cb5c17cd92',
        pinata_secret_api_key: 'a94689cdb6130f38863f0ebb6675eee19bd11556bd5f6bd6b1963e0ae3814ba4'
      }
    })
    .then(function (response) {
      console.log(response)
    })
    .catch(function (error) {
      console.log(error)
    })
}
