pragma solidity ^0.4.17;

import 'zeppelin-solidity/contracts/token/ERC721/ERC721Token.sol';
import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

contract SubscriptionToken is ERC721Token, Ownable {
  string public constant name_ = "SubscriptionToken";
  string public constant symbol_ = "SUB";
  uint256 private constant price = 0.1 ether;

  // TODO set token ID correctly
  // TODO store plan metadata in token
  function purchaseSubscription() public payable {
    require(msg.value == price);
    _mint(msg.sender, totalSupply());
  }

  function hasValidSubscription(address _owner) public view returns (bool)  {
    if (balanceOf(_owner) > 1) return true;
    return false;
  }

}
