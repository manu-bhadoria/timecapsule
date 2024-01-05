    require('dotenv').config();
    const express = require('express');
    const Web3 = require('web3');
    const cors = require('cors');

    // Initialize Express app
    const app = express();
    app.use(cors());
    app.use(express.json());

    // Set up Web3
    const web3 = new Web3(process.env.ETHEREUM_RPC_URL);

    // Import the contract ABI and address
    const TimeCapsuleContract = require('../../build/contracts/TimeCapsule.json');
    const timeCapsuleAddress = process.env.TIME_CAPSULE_CONTRACT_ADDRESS;
    const timeCapsuleContract = new web3.eth.Contract(TimeCapsuleContract.abi, process.env.TIME_CAPSULE_CONTRACT_ADDRESS);
    console.log("Time Capsule Contract Address:", process.env.TIME_CAPSULE_CONTRACT_ADDRESS);

    // Endpoint to fetch all capsules for a specific user
    app.get('/api/capsules/:address', async (req, res) => {
        try {
            const { address } = req.params;
            const capsules = await timeCapsuleContract.methods.getCapsules().call({ from: address });
            res.json(capsules);
        } catch (error) {
            console.error('Error fetching capsules:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    // Additional endpoints for other functionalities can be added here

    // Start the server
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
