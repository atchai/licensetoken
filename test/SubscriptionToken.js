import assertRevert from "zeppelin-solidity/test/helpers/assertRevert";

const SubscriptionToken = artifacts.require("SubscriptionToken");

contract("Subscription token", accounts => {
  it("Should make first account an owner", async () => {
    let instance = await SubscriptionToken.deployed();
    let owner = await instance.owner();
    assert.equal(owner, accounts[0]);
  });

});
