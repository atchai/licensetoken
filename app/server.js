const express = require('express');
const MetaAuth = require('meta-auth');
const Web3 = require('web3');
const HDWalletProvider = require("truffle-hdwallet-provider");

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}

const mnemonic = process.env.MNEMONIC
const infura_api = process.env.INFURA_API
const contract_address = process.env.CONTRACT_ADDRESS
const contract_abi = require('./src/abi.js');

var web3 = new Web3(
  new HDWalletProvider(mnemonic, "https://ropsten.infura.io/" + infura_api)
);

const app = express();
const metaAuth = new MetaAuth({
  banner: 'Token License Login'
});

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
