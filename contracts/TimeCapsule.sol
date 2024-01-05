// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TimeCapsule {
    struct Capsule {
        string message;
        uint256 unlockTime;
        bool isUnlocked;
    }

    mapping(address => Capsule[]) private capsules;
    address public trustedSource = 0xTrustedSourceAddress; // Replace with actual trusted source address

    // Event for capsule creation
    event CapsuleCreated(address indexed user, uint256 index, string message, uint256 unlockTime);

    // Event for capsule unlocking
    event CapsuleUnlocked(address indexed user, uint256 index);

    // Event for Wormhole message
    event WormholeMessage(uint256 indexed unlockTime, address indexed recipient, uint256 amount, bytes signature);

    // Event for an action triggered by a Wormhole message
    event ActionTriggered(address indexed triggeredBy, uint256 value);

    // Create a new time capsule
    function createCapsule(string memory _message, uint256 _unlockTime) public {
        require(_unlockTime > block.timestamp, "Unlock time must be in the future");
        
        Capsule memory newCapsule = Capsule({
            message: _message,
            unlockTime: _unlockTime,
            isUnlocked: false
        });

        capsules[msg.sender].push(newCapsule);
        uint256 index = capsules[msg.sender].length - 1;

        emit CapsuleCreated(msg.sender, index, _message, _unlockTime);

        // Example usage of WormholeMessage event
        // Here we assume the amount and signature are hypothetical and for demonstration
        emit WormholeMessage(_unlockTime, msg.sender, 0, ""); // 0 amount and empty signature for demonstration
    }

    // Unlock a time capsule
    function unlockCapsule(uint256 _index) public {
        require(_index < capsules[msg.sender].length, "Invalid capsule index");
        Capsule storage capsule = capsules[msg.sender][_index];
        require(!capsule.isUnlocked, "Capsule is already unlocked");
        require(block.timestamp >= capsule.unlockTime, "Capsule is still locked");

        capsule.isUnlocked = true;
        emit CapsuleUnlocked(msg.sender, _index);
    }

    // Retrieve capsule data
    function getCapsule(uint256 _index) public view returns (string memory, uint256, bool) {
        require(_index < capsules[msg.sender].length, "Invalid capsule index");
        Capsule memory capsule = capsules[msg.sender][_index];
        return (capsule.message, capsule.unlockTime, capsule.isUnlocked);
    }

    // Retrieve all capsules for a user
    function getCapsules() public view returns (Capsule[] memory) {
        return capsules[msg.sender];
    }

    // Function to handle incoming messages from Wormhole
    // This is a placeholder for the actual logic
    function handleIncomingMessage(bytes memory wormholePayload, bytes memory signature) public {
        // Verify the message
        require(verifyMessage(wormholePayload, signature), "Invalid signature");

        // Actual message handling logic goes here
    }


    // Function to handle incoming messages from Wormhole
    function handleIncomingMessage(bytes memory wormholePayload, bytes memory signature) public {
        // Verify the message
        require(verifyMessage(wormholePayload, signature), "Invalid signature");

        // Decode the payload
        (address addr, uint256 value) = decodePayload(wormholePayload);

        // Perform some action based on the decoded message
        performAction(addr, value);
    }

    // Decode the payload into its components
    function decodePayload(bytes memory payload) internal pure returns (address, uint256) {
        require(payload.length == 52, "Invalid payload length");

        address addr;
        uint256 value;

        // Extract address and value from payload
        assembly {
            addr := mload(add(payload, 20)) // First 20 bytes for address
            value := mload(add(payload, 52)) // Next 32 bytes for uint256 value
        }

        return (addr, value);
    }

    // Example action based on the message
    function performAction(address addr, uint256 value) internal {
        // Logic for the action
        // For example, emitting an event for demonstration
        emit ActionTriggered(addr, value);

        // Other state changes or function calls can be placed here
    }

    // Utility function to split a signature into its components
    function splitSignature(bytes memory sig) internal pure returns (uint8, bytes32, bytes32) {
        require(sig.length == 65, "Invalid signature length");

        bytes32 r;
        bytes32 s;
        uint8 v;

        assembly {
            r := mload(add(sig, 32))
            s := mload(add(sig, 64))
            v := byte(0, mload(add(sig, 96)))
        }

        return (v, r, s);
    }
}
