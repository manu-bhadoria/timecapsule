// CreateCapsule.js
import React, { useState } from 'react';

function CreateCapsule({ createCapsule }) {
    const [message, setMessage] = useState('');
    const [amount, setAmount] = useState('');
    const [unlockDate, setUnlockDate] = useState('');
    const [unlockTime, setUnlockTime] = useState('');
    const [network, setNetwork] = useState('ethereum'); 

    const handleSubmit = async (event) => {
        event.preventDefault();
        const unlockDateTime = new Date(`${unlockDate}T${unlockTime}`).getTime() / 1000;

        createCapsule(message, amount, unlockDateTime, network);

        setMessage('');
        setAmount('');
        setUnlockDate('');
        setUnlockTime('');
    };

    return (
        <div className="create-capsule">
            <h2>Create a Time Capsule</h2>
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label>Message (optional for ETH capsules):</label>
                    <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
                </div>
                <div className="input-group">
                    <label>Amount (ETH, optional for message capsules):</label>
                    <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter amount in ETH" />
                </div>
                <div className="input-group">
                    <label>Unlock Date:</label>
                    <input type="date" value={unlockDate} onChange={(e) => setUnlockDate(e.target.value)} />
                </div>
                <div className="input-group">
                    <label>Unlock Time:</label>
                    <input type="time" value={unlockTime} onChange={(e) => setUnlockTime(e.target.value)} />
                </div>
                <button type="submit" className="submit-button">Create Capsule</button>
            </form>
        </div>
    );
}

export default CreateCapsule;
