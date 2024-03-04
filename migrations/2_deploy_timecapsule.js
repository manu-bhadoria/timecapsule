const TimeCapsule = artifacts.require("TimeCapsule");

module.exports = function (deployer, network) {
  if (network === 'development') { 
    const trustedSourceAddress = '0x81DCE163e2b357792b50Ff2c0B294287B6a8a866';
    deployer.deploy(TimeCapsule, trustedSourceAddress);
  }
};