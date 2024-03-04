const ArbitrumTimeCapsule = artifacts.require("ArbitrumTimeCapsule");

module.exports = function (deployer, network) {
  if (network === 'sepolia') { 
    const trustedSourceAddress = '0x81DCE163e2b357792b50Ff2c0B294287B6a8a866';
    deployer.deploy(ArbitrumTimeCapsule, trustedSourceAddress);
  }
};
