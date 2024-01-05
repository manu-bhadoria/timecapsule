require('dotenv').config();
const { Web3 } = require('web3');
const { getSignedVAA } = require('@certusone/wormhole-sdk');
const timeCapsuleContractAddress = process.env.TIME_CAPSULE_CONTRACT_ADDRESS;
const ETH_RPC_URL='wss://sepolia.infura.io/ws/v3/c6d02468423647ee9a59637665f9969d';

// Initialize Web3
const web3 = new Web3(process.env.ETH_RPC_URL);

// Define the ABI for the event
const timeCapsuleAbi = [
    // Add only the relevant part of the ABI here
    {
        "anonymous": false,
        "inputs": [
            {"indexed": true, "internalType": "uint256", "name": "unlockTime", "type": "uint256"},
            {"indexed": true, "internalType": "address", "name": "recipient", "type": "address"},
            {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"}
        ],
        "name": "WormholeMessage",
        "type": "event"
    }
];

// Create a contract instance
const timeCapsuleContract = new web3.eth.Contract(timeCapsuleAbi, timeCapsuleContractAddress);
const wormholeRpcHost = 'https://api.testnet.wormholescan.io'; // Example for testnet
const chainId = 11155111; // Replace with the correct chain ID for Ethereum
const emitterAddress = process.env.EMITTER_ADDRESS;

// Event listener
timeCapsuleContract.events.WormholeMessage({
    fromBlock: 'latest'
}, async (error, event) => {
    if (error) {
        console.error('Error on event', error);
        return;
    }

    console.log('Event received:', event);

    // Logic to handle the event and create a Wormhole message
    const { unlockTime, recipient, amount } = event.returnValues;
    const sequence = event.returnValues.sequence; // Assuming this is part of your event data

    // Here, you would use the Wormhole SDK to create and send a message
    // This is a placeholder for where you'd implement the SDK logic
    try {
        const signedVAA = await getSignedVAA(wormholeRpcHost, chainId, emitterAddress, sequence);
        // Further logic to handle the signed VAA
        console.log('Signed VAA:', signedVAA);

    } catch (sdkError) {
        console.error('Error using Wormhole SDK:', sdkError);
    }
});

console.log('Listening for WormholeMessage events...');
