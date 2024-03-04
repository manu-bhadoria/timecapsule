import React, { useEffect, useState } from 'react';
import { web3, timeCapsuleContract } from '../web3Setup';

function ViewCapsules() {
    const [capsules, setCapsules] = useState([]);

    useEffect(() => {
      const loadCapsules = async () => {
          try {
              const accounts = await web3.eth.getAccounts();
              const fetchedCapsules = await timeCapsuleContract.methods.getCapsules().call({ from: accounts[0] });

              const formattedCapsules = fetchedCapsules.map((capsule) => {
                  const creationDate = new Date(capsule.creationTime * 1000).toLocaleString();
                  const unlockDate = new Date(capsule.unlockTime * 1000).toLocaleString();
                  const isEthCapsule = capsule.amount && capsule.amount !== '0';

                  return {
                      ...capsule,
                      creationDate, 
                      unlockDate,
                      isEthCapsule,
                  };
              });

              setCapsules(formattedCapsules);
          } catch (error) {
              console.error('Error fetching capsules:', error);
          }
      };

      loadCapsules();
  }, []);

    return (
        <div className="view-capsules">
            <h2>Your Time Capsules</h2>
            <ul>
                {capsules.map((capsule, index) => (
                    <li key={index}>
                        {capsule.isEthCapsule ? (
                            <>
                                <p>Amount: {web3.utils.fromWei(capsule.amount, 'ether')} ETH</p>
                                <p>Created: {capsule.creationDate}</p>
                                <p>Unlock Date: {capsule.unlockDate}</p>
                            </>
                        ) : (
                            <>
                                <p>Message: {capsule.message}</p>
                                <p>Created: {capsule.creationDate}</p>
                                <p>Unlock Date: {capsule.unlockDate}</p>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ViewCapsules;
