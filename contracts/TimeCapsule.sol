// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
pragma experimental ABIEncoderV2;

contract TimeCapsule {
    struct Capsule {
        string message;
        uint256 unlockTime;
        uint256 creationTime;
        bool isUnlocked;
    }

    mapping(address => Capsule[]) private capsules;
    address public trustedSource;

    event CapsuleCreated(address indexed user, uint256 index, string message, uint256 unlockTime);
    event CapsuleUnlocked(address indexed user, uint256 index);

    constructor(address _trustedSource) public {
        trustedSource = _trustedSource;
    }

    function createCapsule(string memory _message, uint256 _unlockTime) public {
        require(_unlockTime > block.timestamp, "Unlock time must be in the future");
        capsules[msg.sender].push(Capsule(_message, _unlockTime, block.timestamp, false));
        emit CapsuleCreated(msg.sender, capsules[msg.sender].length - 1, _message, _unlockTime);
    }

    function unlockCapsule(uint256 _index) public {
        require(_index < capsules[msg.sender].length, "Invalid capsule index");
        Capsule storage capsule = capsules[msg.sender][_index];
        require(!capsule.isUnlocked, "Capsule is already unlocked");
        require(block.timestamp >= capsule.unlockTime, "Capsule is still locked");
        capsule.isUnlocked = true;
        emit CapsuleUnlocked(msg.sender, _index);
    }

    function getCapsule(uint256 _index) public view returns (string memory, uint256, uint256, bool) {
        require(_index < capsules[msg.sender].length, "Invalid capsule index");
        Capsule storage capsule = capsules[msg.sender][_index];
        return (capsule.message, capsule.unlockTime, capsule.creationTime, capsule.isUnlocked);
    }

    function getCapsules() public view returns (Capsule[] memory) {
        return capsules[msg.sender];
    }
}
