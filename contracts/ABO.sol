// SPDX-License-Identifier: GPL-3.0
// Solidity program to demonstrate
// how to create a contract
pragma solidity >=0.7.0 <0.9.0;
pragma abicoder v2;


// Creating a contract
contract ABO {	
    // Declaring variable
    address public betterOcean = 0x86D15B422D924D9115986Dd7A87ee794CAF2cbaF;
    mapping (address => bool) public ngoWallets;
    mapping (uint => abo_contract) public projectIdToContract;
    mapping (uint => ngoEvent) public eventIdToNgoEvent;
    uint public nextProjectId = 0;
    uint public nextEventId = 0;
    uint public aboFeeInPercent = 2;


    struct abo_contract{
        uint projectID;
        address ngoAddress;
        address donorAddress;
        uint donation;
        string pointer;
        //bool paid;
        //string label;
    }

    struct ngoEvent{
        uint eventID;
        uint projectID;
        address ngoAddress;
        //uint cost;
        string urlToRealLiveData;
    }

    // abo_contract[] public abo_contracts;

    modifier isBetterOcean() {
        require(msg.sender == betterOcean);
        _;
    }

    modifier isValidNgo() {
        require(ngoWallets[msg.sender]);
        _;
    }

    function whitelistNgo(address _ngoAddress) isBetterOcean public {
        ngoWallets[_ngoAddress] = true;
    }

    function createContract(uint _donation, string memory _pointer) isValidNgo public {
        uint projectId = nextProjectId++;
        projectIdToContract[projectId] = abo_contract(projectId, msg.sender, address(0), _donation, _pointer);
    }

    function getContracts() public view returns (abo_contract[] memory) {
        abo_contract [] memory memoryArray = new abo_contract[](nextProjectId);
        for(uint i = 0; i < nextProjectId; i++) {
            memoryArray[i] = projectIdToContract[i];
        }
        return memoryArray;
    }

    function donate(uint _projectId) public payable{
        require(msg.value == projectIdToContract[_projectId].donation * (1 ether));        
        uint aboFee = msg.value * aboFeeInPercent / 100; 
        uint ngoAmount = msg.value - aboFee; 
        // make a payment to NGO
        address ngoAddress  = projectIdToContract[_projectId].ngoAddress;
        payable(ngoAddress).transfer(ngoAmount);
        // make a payment ABO
        payable(betterOcean).transfer(aboFee);
        abo_contract storage myContract = projectIdToContract[_projectId];
        myContract.donorAddress = msg.sender;
    } 

    function logNgoEvent(uint _projectId, string memory _pointerToRealLiveData) public isValidNgo {
        uint eventId = nextEventId++;
        eventIdToNgoEvent[eventId] = ngoEvent(eventId, _projectId, msg.sender, _pointerToRealLiveData);

    }

    function getNgoEvents() public view returns (ngoEvent[] memory) {
        ngoEvent [] memory eventLog = new ngoEvent[](nextEventId);
        for(uint i = 0; i < nextEventId; i++) {
            eventLog[i] = eventIdToNgoEvent[i];
        }
        return eventLog;
    }
}
