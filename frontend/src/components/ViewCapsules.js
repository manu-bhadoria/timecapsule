import React, { useEffect, useState } from 'react';
import { EthTimeCapsule, web3 } from '../web3Setup'; // Named imports


function ViewCapsules() {
  const [capsules, setCapsules] = useState([]);

  useEffect(() => {
    const loadCapsules = async () => {
      const fetchedCapsules = await EthTimeCapsule.methods.getCapsules().call({ from: window.ethereum.selectedAddress });
      setCapsules(fetchedCapsules);
    };

    loadCapsules();
  }, []);

  return (
    <div>
      <h2>Your Time Capsules</h2>
      <ul>
        {capsules.map((capsule, index) => {
          const unlockDate = new Date(capsule.unlockTime * 1000);
          const formattedDate = unlockDate.toLocaleDateString();
          // Inside the map function
          const isETHCapsule = capsule.amount !== undefined;
          const ethAmount = isETHCapsule ? web3.utils.fromWei(capsule.amount, 'ether') : null;

          return (
            <li key={index}>
              {isETHCapsule ? (
                <>
                  Amount: {ethAmount} ETH, Unlock Date: {formattedDate}, 
                </>
              ) : (
                <>
                  Message: {capsule.message}, Unlock Date: {formattedDate}
                </>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default ViewCapsules;
