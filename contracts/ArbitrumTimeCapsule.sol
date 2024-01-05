// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ArbitrumTimeCapsule {
    struct Capsule {
        uint256 amount;
        uint256 unlockTime;
        bool isUnlocked;
    }

    mapping(bytes32 => Capsule) public capsules;
    address public trustedSource = 0xTrustedSourceAddress; // Replace with actual trusted source address

    event CapsuleUnlocked(bytes32 indexed capsuleId, uint256 amount, address recipient);
    event ActionTriggered(bytes32 indexed capsuleId, uint256 value);

    // Unlock the time capsule
    function unlockCapsule(bytes32 capsuleId, uint256 amount, uint256 unlockTime, address recipient) public {
        // Only allow the trusted source (Wormhole or a designated address) to call this function
        require(msg.sender == trustedSource, "Unauthorized source");

        Capsule storage capsule = capsules[capsuleId];

        // Check if the capsule is already unlocked
        require(!capsule.isUnlocked, "Capsule already unlocked");

        // Verify unlock conditions
        require(block.timestamp >= unlockTime, "Capsule is still locked");

        // Unlock the capsule
        capsule.amount = amount;
        capsule.unlockTime = unlockTime;
        capsule.isUnlocked = true;

        // Transfer the amount to the recipient
        payable(recipient).transfer(amount);

        // Emit an event
        emit CapsuleUnlocked(capsuleId, amount, recipient);
    }

    // Fallback function to receive ETH
    receive() external payable {}

    // Function to handle incoming messages from Wormhole
    function handleIncomingMessage(bytes32 capsuleId, bytes memory wormholePayload) public {
        // Verify that the sender is the trusted source
        require(msg.sender == trustedSource, "Unauthorized source");

        // Decode the payload
        (uint256 amount, uint256 unlockTime, address recipient) = decodePayload(wormholePayload);

        // Perform some action based on the decoded message
        performAction(capsuleId, amount, unlockTime, recipient);
    }

    // Decode the payload into its components
    function decodePayload(bytes memory payload) internal pure returns (uint256, uint256, address) {
        require(payload.length == 52, "Invalid payload length");

        uint256 amount;
        uint256 unlockTime;
        address recipient;

        // Extract data from payload
        assembly {
            amount := mload(add(payload, 32)) // First 32 bytes for amount
            unlockTime := mload(add(payload, 64)) // Next 32 bytes for unlockTime
            recipient := mload(add(payload, 96)) // Next 20 bytes for address
        }

        return (amount, unlockTime, recipient);
    }

    function performAction(bytes32 capsuleId, uint256 amount, uint256 unlockTime, address recipient) internal {
        // Check if the capsule already exists
        Capsule storage capsule = capsules[capsuleId];

        // If the capsule does not exist, create a new one with the given parameters
        if (capsule.unlockTime == 0) {
            capsule.amount = amount;
            capsule.unlockTime = unlockTime;
            capsule.isUnlocked = false;
        }

        // Check if the current time is greater than or equal to the unlockTime of the capsule
        if (block.timestamp >= unlockTime) {
            // Unlock the capsule if it is not already unlocked
            if (!capsule.isUnlocked) {
                capsule.isUnlocked = true;
                emit CapsuleUnlocked(capsuleId, amount, recipient);

                // Transfer the amount to the recipient if the amount is greater than 0
                if (amount > 0) {
                    payable(recipient).transfer(amount);
                }
            }
        }
    }
}
