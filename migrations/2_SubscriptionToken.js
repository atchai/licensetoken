var SubscriptionToken = artifacts.require("SubscriptionToken");

module.exports = function(deployer) {
    deployer.deploy(SubscriptionToken);
};