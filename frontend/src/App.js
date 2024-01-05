import './Starfield.css';
import React, { useState } from 'react';
import CreateCapsule from './components/CreateCapsule';
import ViewCapsules from './components/ViewCapsules';
import { web3, timeCapsuleContract } from './web3Setup'; // Adjust the path as necessary
import Web3 from 'web3';
import initStarfield from './Starfield';
import './Starfield.css';
import './App.css'



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
        await window.ethereum.enable(); // Request account access
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);
      } catch (error) {
        console.error("Failed to enable Ethereum.");
      }
    } else {
      alert("Please install MetaMask!");
    }
  };
  const createCapsule = async (message, unlockTime) => {
    try {
      const accounts = await web3.eth.getAccounts();
      await timeCapsuleContract.methods.createCapsule(message, unlockTime).send({ from: accounts[0] });
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
    <div className="App">
      <header className="App-header">
        <h1>Time Capsule DApp</h1>
        <button onClick={connectWalletHandler}>Connect Wallet</button>
        {account && <p>Connected Account: {account}</p>}
      </header>
      <CreateCapsule createCapsule={createCapsule} />
      <ViewCapsules getCapsules={getCapsules} />
    </div>
  );
}

export default App;
