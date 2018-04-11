const express = require('express');
const MetaAuth = require('meta-auth');
const Web3 = require('web3');
const HDWalletProvider = require("truffle-hdwallet-provider");

let contract_address = undefined

// development
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
  contract_address = '0x8f0483125fcb9aaaefa9209d8e9d7b9c8b9fb90f'
  var web3 = new Web3(
    new Web3.providers.HttpProvider('http://127.0.0.1:7545')
  );
}

// production
else {
  contract_address = '0x9a654669beb121f429941105ce868e81f7a282a0'
  const mnemonic = process.env.MNEMONIC
  const infura_api = process.env.INFURA_API
  var web3 = new Web3(
    new HDWalletProvider(mnemonic, "https://ropsten.infura.io/" + infura_api)
  );
}

const contract_abi = require('./src/abi.js');
const port = process.env.PORT || '3001'

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
          console.log(result.c[0])
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

app.listen(port, () => {
  console.log('Listening on port ' + port)
})
