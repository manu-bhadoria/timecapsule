import './Starfield.css';
import React, { useState } from 'react';
import CreateCapsule from './components/CreateCapsule';
import ViewCapsules from './components/ViewCapsules';
import { web3, timeCapsuleContract, arbitrumTimeCapsuleContract } from './web3Setup'; // Adjust import for Arbitrum contract
import Web3 from 'web3';
import initStarfield from './Starfield';
import './Starfield.css';
import './App.css';
import { motion } from 'framer-motion';
import WormholeBridge from '@wormhole-foundation/wormhole-connect';


const wormholeGuardianNetwork = process.env.REACT_APP_WORMHOLE_GUARDIAN_NETWORK;
const ethereumRpcUrl = process.env.REACT_APP_ETHEREUM_RPC_URL;
const arbitrumRpcUrl = process.env.REACT_APP_ARBITRUM_RPC_URL;



function App() {
  React.useEffect(() => {
    initStarfield();
  }, []);
  const [account, setAccount] = useState(null);

  const connectWalletHandler = async () => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      try {
        await window.ethereum.enable();
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);
      } catch (error) {
        console.error("Failed to enable Ethereum.");
      }
    } else {
      alert("Please install MetaMask!");
    }
  };
  const createCapsule = async (message, amount, unlockTime, network) => {
    try {
      const accounts = await web3.eth.getAccounts();

      if (network === 'ethereum') {
        if (amount && amount > 0) {
          await timeCapsuleContract.methods.createCapsule(message, unlockTime)
            .send({ from: accounts[0], value: web3.utils.toWei(amount, 'ether') });
        } else {
          await timeCapsuleContract.methods.createCapsule(message, unlockTime)
            .send({ from: accounts[0] });
        }
      } else if (network === 'arbitrum') {

        console.log('Arbitrum network logic to be implemented');
      }

      console.log('Capsule created successfully');
    } catch (error) {
      console.error('Error creating capsule:', error);
    }
  };

  const getCapsules = async () => {
    try {
      const accounts = await web3.eth.getAccounts();
      const capsules = await timeCapsuleContract.methods.getCapsules().call({ from: accounts[0] });
      console.log('Capsules fetched successfully:', capsules);
      return capsules;
    } catch (error) {
      console.error('Error fetching capsules:', error);
      return [];
    }
  };
  return (
    
    <motion.div className="App"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <header className="App-header">
        <motion.h1
          initial={{ y: -250 }}
          animate={{ y: -10 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 120 }}
        >
          Time Capsule DApp
        </motion.h1>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={connectWalletHandler}
        >
          Connect Wallet
        </motion.button>
        {account && <p>Connected Account: {account}</p>}
      </header>
      <CreateCapsule createCapsule={createCapsule} />
      <ViewCapsules getCapsules={getCapsules} />
    </motion.div>
  );
  
}

export default App;
