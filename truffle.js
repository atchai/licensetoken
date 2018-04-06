require("babel-register")({
  ignore: /node_modules\/(?!zeppelin-solidity)/
});
require("babel-polyfill");

var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = "lonely today dentist sibling gap rich jaguar veteran awkward lens lobster evoke";

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!

  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/bj5FjcF54IYrWqMeggWc")
      },
      network_id: 3,
      gas: 3000000000000000000000
    }
  },
  solc: {
  optimizer: {
    enabled: true,
    runs: 200
  }
}

};
