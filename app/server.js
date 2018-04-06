const express = require('express');
const MetaAuth = require('meta-auth');
const Web3 = require('web3');
var web3 = new Web3(
    new Web3.providers.HttpProvider('http://127.0.0.1:7545')
);

const app = express();
const metaAuth = new MetaAuth({
  banner: 'Token License Login'
});

const contract_address = '0x345ca3e014aaf5dca488057592ee47305d9b3e10';
const contract_abi = require('./src/abi.js');

var token = web3.eth.contract(contract_abi).at(contract_address);

app.use('/', express.static('.'));

app.get('/auth/:MetaAddress', metaAuth, (req, res) => {
  // Request a message from the server
  if (req.metaAuth && req.metaAuth.challenge) {
    res.send(req.metaAuth.challenge)
  }
});

app.get('/auth/:MetaMessage/:MetaSignature', metaAuth, (req, res) => {

  if (req.metaAuth && req.metaAuth.recovered) {

    // Check whether this user has a valid subscription in ERC721 token
    token.balanceOf(req.metaAuth.recovered,
      function (err, result) {
        if (err) {
          return console.error(err);;
        }
        else {
          // Authentication is valid, assign JWT, etc.
          if (result.c[0] > 0) res.send(req.metaAuth.recovered);
          // Authentication fail, no subscription token
          else res.status(400).send();
        }
    });

  } else {
    // Sig did not match, invalid authentication
    res.status(400).send();
  };
});

app.listen(3001, () => {
  console.log('Listening on port 3001')
})
