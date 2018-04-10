# LicenseToken

This is a demonstration of how ERC721 tokens can be used to represent software licenses.

You buy a token, then authenticate with a server by cryptographically verifying that you own the address that owns the token.


## Run locally

### Prerequisites

* Node.js v8.9.4
* Ganache (or some other local test ethereum node)
* Infura API account and ethereum account loaded with some ETH (we're using Ropsten)
* The following environment variables set in a .env file in /app:
  * MNEMONIC  (seed mnemonic of an account where first derived address has positive balance)
  * INFURA_API (infura eth node api key)
  * NETWORK_ID (eth network id to use - e.g.  ropsten is 3)
  * CONTRACT_ADDRESS (address of the deployed contract, you'll get this after running truffle)
  * PORT

### Installation

```
npm install
```

Deploy contract:

`truffle migrate`

Insert the contract address as an environemnt variable - see Prerequisites
Manually update contract_address and server_address in app/src/index.js

Run the server:
```
cd app
npm install
npm start
```

Start Ganache or another ethereum node - server.js expects it to be available on port 7454

In a browser go to: http://localhost:3001

Connect to Ganache's network in metamask and import a user from Ganache so that you have ether to spend.
