const TimeCapsule = artifacts.require("TimeCapsule");

contract("TimeCapsule", (accounts) => {
    let timeCapsuleInstance;

    before(async () => {
        timeCapsuleInstance = await TimeCapsule.deployed();
    });

    it("should create a time capsule", async () => {
        // Test data
        const testMessage = "This is a test message";
        const testUnlockTime = Math.floor(Date.now() / 1000) + 600; // Current time + 10 minutes in seconds

        // Create a time capsule
        await timeCapsuleInstance.createCapsule(testMessage, testUnlockTime, { from: accounts[0] });

        // Retrieve the created capsule
        const capsule = await timeCapsuleInstance.getCapsule(0, { from: accounts[0] });
        const { '0': retrievedMessage, '1': retrievedTimestamp, '2': retrievedIsUnlocked } = capsule;

        // Assert that the retrieved message matches the input message
        assert.equal(retrievedMessage, testMessage, "The message of the capsule does not match the input");
        
        // Convert the retrieved timestamp to a number for comparison
        const retrievedTimestampNumber = retrievedTimestamp.toNumber();
        
        // Assert that the retrieved timestamp matches the input timestamp
        assert.equal(retrievedTimestampNumber, testUnlockTime, "The unlock time of the capsule does not match the input");
        
        // Assert that the capsule is initially locked
        assert.equal(retrievedIsUnlocked, false, "The capsule should be locked initially");
        
    });
    it("should create a time capsule", async () => {
        const testMessage = "This is a test message";
        const testUnlockTime = Math.floor(Date.now() / 1000) + 600; // 10 minutes in the future

        await timeCapsuleInstance.createCapsule(testMessage, testUnlockTime, { from: accounts[0] });
        const capsule = await timeCapsuleInstance.getCapsule(0, { from: accounts[0] });

        assert.equal(capsule[0], testMessage, "Message mismatch");
        assert.equal(capsule[1].toNumber(), testUnlockTime, "Unlock time mismatch");
        assert.equal(capsule[2], false, "Capsule should be locked");
    });

    it("should not unlock a capsule before the unlock time", async () => {
        try {
            await timeCapsuleInstance.unlockCapsule(0, { from: accounts[0] });
            assert.fail("The capsule was unlocked before the unlock time");
        } catch (error) {
            assert(error.toString().includes("Capsule is still locked"), "Expected lock error not received");
        }
    });

    it("should unlock a capsule after the unlock time", async () => {
        // Wait for unlock time to pass
        await new Promise(resolve => setTimeout(resolve, 601000)); // Wait for 10 minutes and 1 second

        await timeCapsuleInstance.unlockCapsule(0, { from: accounts[0] });
        const capsule = await timeCapsuleInstance.getCapsule(0, { from: accounts[0] });

        assert.equal(capsule[2], true, "Capsule should be unlocked");
    });
});