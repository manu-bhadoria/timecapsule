const EthTimeCapsule = artifacts.require("EthTimeCapsule");

contract("EthTimeCapsule", (accounts) => {
    const [owner] = accounts;

    it("should create a time capsule", async () => {
        const contract = await EthTimeCapsule.deployed();
        await contract.createCapsule(Math.floor(Date.now() / 1000) + 300, { from: owner, value: web3.utils.toWei("1", "ether") });
        const capsule = await contract.getCapsule(0);
        assert.equal(capsule.amount, web3.utils.toWei("1", "ether"), "Amount of ETH is incorrect");
    });

    it("should not allow creating a capsule with zero ETH", async () => {
        try {
            await contract.createCapsule(Math.floor(Date.now() / 1000) + 300, { from: owner, value: 0 });
            assert.fail("Should have thrown an error");
        } catch (error) {
            assert.include(error.message, "Must send ETH to create a capsule", "Error message is not correct");
        }
    });
    
    it("should not allow unlocking before the set time", async () => {
        const unlockTime = Math.floor(Date.now() / 1000) + 300;
        await contract.createCapsule(unlockTime, { from: owner, value: web3.utils.toWei("1", "ether") });
        try {
            await contract.unlockCapsule(0, { from: owner });
            assert.fail("Should have thrown an error");
        } catch (error) {
            assert.include(error.message, "Capsule is still locked", "Error message is not correct");
        }
    });
});
