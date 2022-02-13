const ABO = artifacts.require("ABO");
contract("ABO", (accounts) => {
    let [master, ngo1, ngo2, ngo3, ngo4, donor1, donor2, donor3, donor4] = accounts;
    let abo;
    beforeEach(async () => {
        abo = await ABO.new();
    });
    it("should whitelist", async () => {
        assert(true);
        await abo.whitelistNgo(ngo1, {from: master});
        //assert(abo.ngoWallets[ngo1]);
        //assert(abo.ngoWallets[ngo2]);
    })
})
