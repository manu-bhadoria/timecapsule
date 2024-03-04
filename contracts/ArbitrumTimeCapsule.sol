// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;


import "@wormhole-foundation/wormhole-sdk/contracts/IWormhole.sol";


contract ArbitrumTimeCapsule {
    struct Capsule {
        uint256 amount;
        uint256 unlockTime;
        bool isUnlocked;
    }

    mapping(bytes32 => Capsule) public capsules;
    address public trustedSource;

    event CapsuleUnlocked(bytes32 indexed capsuleId, uint256 amount, address recipient);

   // IWormhole public wormhole; Wormhole contract instance

    constructor(address _trustedSource, address _wormhole) public {
        trustedSource = _trustedSource;
        wormhole = IWormhole(_wormhole);
    }

    // Function to unlock capsule with a Wormhole message
    function unlockCapsuleWithMessage(bytes32 capsuleId, uint256 unlockTime, address payable recipient, bytes memory wormholePayload) public {
        // Placeholder for Wormhole message verification

        require(wormhole.verifyWormholeMessage(wormholePayload), "Invalid Wormhole message");

        Capsule storage capsule = capsules[capsuleId];
        require(!capsule.isUnlocked, "Capsule already unlocked");
        require(block.timestamp >= unlockTime, "Capsule is still locked");


        // placeholder for parsing logic 
        uint256 amount = parseAmountFromWormholePayload(wormholePayload);

        capsule.amount = amount;
        capsule.unlockTime = unlockTime;
        capsule.isUnlocked = true;

        recipient.transfer(amount);
        emit CapsuleUnlocked(capsuleId, amount, recipient);
    }

    // placeholder for parsing amount from Wormhole payload
    function parseAmountFromWormholePayload(bytes memory payload) internal pure returns (uint256) {
  
        return 0; // 
    }

    function receive() external payable {}
}
