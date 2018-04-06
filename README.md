# LicenseToken

This is a demonstration of how ERC721 tokens can be used to represent software licenses.

You buy a token, then authenticate with a server by cryptographically verifying that you own the address that owns the token.

## How to run locally

```
nvm use v8.9.4
npm install
```

Deploy contract:

`truffle migrate`

Insert the contract address into app - app/server.js and app/src/index.js

Run the server:
```
cd app
npm install
npm start
```

Start Ganache or another ethereum node - server.js expects it to be available on port 7454

In a browser go to: http://localhost:3001

Connect to Ganache's network in metamask and import a user from Ganache so that you have ether to spend.
