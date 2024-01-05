const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const morgan = require('morgan');
const { getSignedVAA } = require('@certusone/wormhole-sdk');
const Web3 = require('web3');

// Load environment variables
require('dotenv').config();

const web3 = new Web3(process.env.ETHEREUM_RPC_URL);
const timeCapsuleABI = require('./path_to_your_ABI.json');
const TimeCapsuleContract = require('../../build/contracts/TimeCapsule.json');

const timeCapsuleAddress = 'your_contract_address_on_ethereum';
const timeCapsuleContract = new web3.eth.Contract(timeCapsuleABI, timeCapsuleAddress);


app.use(morgan('dev')); // Logging
app.use(express.json()); // Body parser

app.listen(port, () => {
  console.log(`Relayer app listening at http://localhost:${port}`);
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});