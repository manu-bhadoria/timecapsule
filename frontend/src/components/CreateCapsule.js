import React, { useState } from 'react';
import { web3, EthTimeCapsule, TimeCapsule } from '../web3Setup'; // Import the contract instances

function CreateCapsule() {
    const [message, setMessage] = useState('');
    const [amount, setAmount] = useState('');
    const [unlockDate, setUnlockDate] = useState('');
    const [network, setNetwork] = useState('ethereum'); // 'ethereum' or 'arbitrum'
     // Network switch handler
     const handleNetworkChange = (event) => {
        setNetwork(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const timestampInSeconds = Math.floor(new Date(unlockDate).getTime() / 1000);
    
        if (amount > 0) {
            await EthTimeCapsule.methods.createCapsule(timestampInSeconds).send({
                from: web3.currentProvider.selectedAddress,
                value: web3.utils.toWei(amount, "ether")
            });
        } else {
            const timeCapsule = await TimeCapsule.deployed();
            await timeCapsule.createCapsule(message, timestampInSeconds, {
                from: web3.currentProvider.selectedAddress
            });
        }
    };
    return (
        <div className="create-capsule">
            <h2 style={{ fontFamily: 'Press Start 2P' }}>Create a Time Capsule</h2>
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label>Message:</label>
                    <input 
                        type="text" 
                        value={message} 
                        onChange={(e) => setMessage(e.target.value)} 
                    />
                </div>
                <div className="input-group">
                    <label>Amount (ETH):</label>
                    <input 
                        type="number" 
                        value={amount} 
                        onChange={(e) => setAmount(e.target.value)} 
                        placeholder="Enter amount in ETH"
                    />
                </div>
                <div className="input-group">
                    <label>Unlock Date:</label>
                    <input 
                        type="date" 
                        value={unlockDate} 
                        onChange={(e) => setUnlockDate(e.target.value)} 
                    />
                </div>
                <button type="submit" className="submit-button">Create Capsule</button>
            </form>
        </div>
    );

}

export default CreateCapsule;
