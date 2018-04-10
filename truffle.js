require("babel-register")({
  ignore: /node_modules\/(?!zeppelin-solidity)/
});
require("babel-polyfill");

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}
const HDWalletProvider = require("truffle-hdwallet-provider");

const mnemonic = process.env.MNEMONIC
const infura_api = process.env.INFURA_API
const network_id = process.env.NETWORK_ID

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!

  networks: {
    'development': {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    ropstengeth: {
     host: "127.0.0.1",
     port: 8545,
     network_id: "3"
   },
    ropsteninfura: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/" + infura_api)
      },
      network_id: network_id,
      gas:4712388
    }
  },
  solc: {
  optimizer: {
    enabled: true,
    runs: 200
  }
}

};
