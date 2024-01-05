const EthTimeCapsule = artifacts.require("EthTimeCapsule");

module.exports = function(deployer) {
    deployer.deploy(EthTimeCapsule);
};
