const ABO = artifacts.require("ABO");
const utils = require("./helpers/utils");
contract("ABO", (accounts) => {
    let [master, ngo1, ngo2, ngo3, ngo4, donor1, donor2, donor3, donor4] = accounts;
    let abo;
    beforeEach(async () => {
        abo = await ABO.new();
    });
    it("whitelist from master and non-master", async () => {
        //create contract from master
        const result = await abo.whitelistNgo(ngo1, {from: master});
        assert.equal(result.receipt.status, true);
        //create contract as non master
        await utils.shouldThrow(abo.whitelistNgo(ngo1, {from: ngo1}))
    })
    it("create contract NGO whitelisted", async () => {
        const result = await abo.whitelistNgo(ngo1, {from: master});
        assert.equal(result.receipt.status, true);
        await abo.createContract(10, 'urlPointerToEvent', {from: ngo1})
    })
    it("create contract NGO non whitelisted", async () => {
        await utils.shouldThrow(abo.createContract(10, 'urlPointerToEvent', {from: ngo1}))
    })
    it("Donate to contract: exiting contract, correct amount", async () => {
        const result = await abo.whitelistNgo(ngo1, {from: master});
        assert.equal(result.receipt.status, true);
        await abo.createContract(10, 'urlPointerToEvent', {from: ngo1})
        await abo.donate(0, {from: donor1, value: web3.utils.toWei('10', 'Ether')})
    })
    it("Donate to contract, which should fail: non-exiting contract, not correct amount, contract was already donated to", async () => {
        const result = await abo.whitelistNgo(ngo1, {from: master});
        assert.equal(result.receipt.status, true);
        await abo.createContract(10, 'urlPointerToEvent', {from: ngo1})
        await utils.shouldThrow(abo.donate(1, {from: donor1, value: web3.utils.toWei('10', 'Ether')})) //donate non-existing contract
        await utils.shouldThrow(abo.donate(0, {from: donor1, value: web3.utils.toWei('5', 'Ether')})) //donate wrong amount
        await abo.donate(0, {from: donor1, value: web3.utils.toWei('10', 'Ether')}) //donate once to contract
        await utils.shouldThrow(abo.donate(0, {from: donor1, value: web3.utils.toWei('10', 'Ether')})) //donate to an already filled contract
    })
    it("Log NGO event, should work", async () => {
        const result = await abo.whitelistNgo(ngo1, {from: master});
        assert.equal(result.receipt.status, true);
        await abo.createContract(10, 'urlPointerToEvent', {from: ngo1})
        await abo.donate(0, {from: donor1, value: web3.utils.toWei('10', 'Ether')})
        abo.logNgoEvent(0, 'URL_pointing_to_advanced_media_items', {from: ngo1})
    })
    it("Log NGO event, should not work: logging to project not existing, logging from wrong NGO, logging of project which has not been funded", async () => {
        const result = await abo.whitelistNgo(ngo1, {from: master});
        assert.equal(result.receipt.status, true);
        await abo.createContract(10, 'urlPointerToEvent', {from: ngo1})
        await utils.shouldThrow(abo.logNgoEvent(1, 'URL_pointing_to_advanced_media_items', {from: ngo1})) // donate to projectID 1 we only created 0
        await utils.shouldThrow(abo.logNgoEvent(0, 'URL_pointing_to_advanced_media_items', {from: ngo2})) // NGO logs event for project he does not own
        await utils.shouldThrow(abo.logNgoEvent(0, 'URL_pointing_to_advanced_media_items', {from: ngo1})) // NGO tries to log event for project which has no funding
        await abo.donate(0, {from: donor1, value: web3.utils.toWei('10', 'Ether')})
        abo.logNgoEvent(0, 'URL_pointing_to_advanced_media_items', {from: ngo1})
    })
    
})
