import $ from 'jquery';
var Web3 = require('web3')

const contract_address = '0x9a654669beb121f429941105ce868e81f7a282a0';  //ropsten
//const address = '0x345ca3e014aaf5dca488057592ee47305d9b3e10';  //dev
const server_address = 'https://licensetoken.herokuapp.com'
//const server_address = 'http://localhost:3001'


const abi = require('./abi.js');
const price = web3.toWei(0.1, 'ether');
const network_id = 3 // ropsten - ethereum network ID

let challenge = null;
let signature = null;

// Check for Metamask and show/hide appropriate warnings.
window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if ((typeof web3 !== 'undefined') && (web3.givenProvider !== null)) {
    var web3js = new Web3(web3.currentProvider);

    // Checking if user is logged into an account
    web3js.eth.getAccounts(function(err, accounts){
        if (err != null) console.error("An error occurred: "+err);

        // User is not logged into Metamask
        else if (accounts.length == 0) {
          $('#metamask-login').show();
          console.log("User is not logged in to MetaMask");
        }

        // User is logged in to Metamask
        else {
          web3js.version.getNetwork((err, net_id) => {
            console.log(net_id);
            if (err != null) console.error("An error occurred: "+err);

            // User is on the correct network
            // Ropsten test network = 3, main net = 1
            else if (net_id == network_id) {
              console.log("User is logged in and on correct network");
              $('#main-content').show();
              startApp(web3js);
            }

            // User is not on the right network
            else {
              console.log("User is logged in and on WRONG network");
              $('#metamask-network').show();
            }
        })
      }
  });

  // User does not have Metamask / web3 provider
  } else {
    console.log('No web3? You should consider trying MetaMask!');
    $('#metamask-install').show();
  }
})



function startApp(web3js) {

  var contract = web3js.eth.contract(abi).at(contract_address);

  $('.buy').on('click', function () {
    contract.purchaseSubscription({
      'from':web3js.eth.accounts[0],
      'value':price
    },
    function (err, transactionHash) {
        console.log(err, transactionHash);
    });
  });

  $('.balance').on('click', function () {
    contract.balanceOf(web3js.eth.accounts[0],
    function (err, res) {
      if (err) {
        return console.error(err);;
      }
      else {
        $('#account_balance').text(res.c[0]);
      }
    });
  });

  $('.get').on('click', function () {
    $('.challenge').empty();
    $.get(server_address + '/auth/' + web3js.eth.accounts[0], (res) => {
      challenge = res

      res.forEach(line => {
        $('.challenge').append(line.name);
        $('.challenge').append('<br>');
        $('.challenge').append(line.value);
        $('.challenge').append('<br>');
      })

      const from = web3js.eth.accounts[0];

      const params = [challenge, from];
      const method = 'eth_signTypedData';

      web3js.currentProvider.sendAsync({
        method,
        params,
        from
      }, async (err, result) => {
        signature = result.result;
        if (err) {
          return console.error(err);
        }
        if (result.error) {
          return console.error(result.error);
        }
        $('.signature').text(signature);
      });
    });

  });

  $('.verify').on('click', function() {

    if (challenge) {
      $.get(server_address + '/auth/' + challenge[1].value + '/' + signature, (res) => {
        if (res === web3js.eth.accounts[0]) {
          $('.success').show();
        } else {
          $('.fail').show();
        }
      });
    }
    else $('.fail').show();
  });
}
