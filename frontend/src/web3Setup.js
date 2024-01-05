import Web3 from 'web3';
import TimeCapsuleContract from './TimeCapsule.json';
import EthTimeCapsuleContract from './EthTimeCapsule.json';


// Your Contract ABI and Address
const timeCapsuleABI = [{
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "message",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "unlockTime",
        "type": "uint256"
      }
    ],
    "name": "CapsuleCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      }
    ],
    "name": "CapsuleUnlocked",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_message",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_unlockTime",
        "type": "uint256"
      }
    ],
    "name": "createCapsule",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_index",
        "type": "uint256"
      }
    ],
    "name": "unlockCapsule",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_index",
        "type": "uint256"
      }
    ],
    "name": "getCapsule",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "getCapsules",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "message",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "unlockTime",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "isUnlocked",
            "type": "bool"
          }
        ],
        "internalType": "struct TimeCapsule.Capsule[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  }];
const timeCapsuleAddress = '0x28F1F0114E71d247691837c49693D6A85CB8a268';

// Initialize web3 and the contract instance
const web3 = new Web3(window.ethereum);
const timeCapsuleContract = new web3.eth.Contract(timeCapsuleABI, timeCapsuleAddress);

const networkId = await web3.eth.net.getId();

const TimeCapsule = new web3.eth.Contract(timeCapsuleABI, timeCapsuleAddress);


const EthTimeCapsule = new web3.eth.Contract(
    EthTimeCapsuleContract.abi,
    EthTimeCapsuleContract.networks[networkId] && EthTimeCapsuleContract.networks[networkId].address,
);
export { web3, timeCapsuleContract, EthTimeCapsule, TimeCapsule };