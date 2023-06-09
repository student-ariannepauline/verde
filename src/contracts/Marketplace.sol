pragma solidity^0.5.0;

contract Marketplace {
    string public name;
    uint public energyCount = 0;
    mapping(uint => Energy) public energies;

    uint public demandCount = 0;
    mapping(uint => EnergyDemand) public energyDemands;


    struct Energy {
        uint id;
        uint quantity;
        uint price;
        address payable owner;
        bool purchased;
    }

    struct EnergyDemand {
        uint id;
        uint quantity;
        uint price;
        address payable owner;
        bool purchased;
    }

    event EnergyCreated(
        uint id,
        uint quantity,
        uint price,
        address payable owner,
        bool purchased
    );

    event EnergyPurchased(
        uint id,
        uint quantity,
        uint price,
        address payable owner,
        bool purchased
    );

    event EnergyDemandCreated(
        uint id,
        uint quantity,
        uint price,
        address payable owner,
        bool purchased
    );

     event EnergyDemandFulfilled(
        uint id,
        uint quantity,
        uint price,
        address buyer,
        address payable seller,
        bool purchased
    );

    constructor() public {
        name = "VerdePay";
    }

    function sellEnergy(uint _quantity, uint _price) public {
        // Require a valid quantity
        require(_quantity > 0);
        //Require a valid price
        require(_price > 0);
        //Increment product count 
        energyCount ++;
        // Create an energy listing
        energies[energyCount] = Energy(energyCount, _quantity, _price, msg.sender, false);
        // Trigger an event
        emit EnergyCreated(energyCount, _quantity, _price, msg.sender, false);
    } 

    function purchaseEnergy(uint _id) public payable {
        //Fetch the product
        Energy memory _energy = energies[_id];
        //Fetch the owner
        address payable _seller = _energy.owner;
        //Require a valid id
        require(_energy.id > 0 && _energy.id <= energyCount);
        //Require that there is enough balance in the transaction
        require(msg.value >= _energy.price);
        //Require that the energy is still available
        require(!_energy.purchased);
        //Require that the buyer is not the seller
        require(_seller != msg.sender);
        //Transfer ownership to the buyer
        _energy.owner = msg.sender;
        //Mark as purchased
        _energy.purchased = true;
        //Update the energy
        energies[_id] = _energy;
        //Pay the seller by sending Ether
        address(_seller).transfer(msg.value);
        //Trigger an event
        emit EnergyPurchased(energyCount, _energy.quantity, _energy.price, msg.sender, true);

    }  

    function createEnergyDemand(uint _quantity, uint _price) public {
        // Require a valid quantity
        require(_quantity > 0);
        // Require a valid price
        require(_price > 0);
        // Increment demand count
        demandCount++;
        // Create a demand listing
        energyDemands[demandCount] = EnergyDemand(demandCount, _quantity, _price, msg.sender, false);
        // Trigger an event
        emit EnergyDemandCreated(demandCount, _quantity, _price, msg.sender, false);
    }

    // function fulfillEnergyDemand(uint _id) public payable {
    //     //Fetch the demand
    //     EnergyDemand memory _demand = energyDemands[_id];
    //     //Fetch the owner
    //     address _buyer = _demand.owner;
    //     //Require a valid id
    //     require(_demand.id > 0 && _demand.id <= demandCount);
    //     //Require that there is enough balance in the transaction
    //     require(msg.value >= _demand.price);
    //     //Require that the energy is still available
    //     require(!_demand.purchased);
    //     //Require that the buyer is not the seller
    //     require(_buyer != msg.sender);

    //     //Mark as purchased
    //     _demand.purchased = true;

    //     //Update the energy
    //     energyDemands[_id] = _demand;

    //     //Pay the seller by sending Ether
    //     _demand.owner = msg.sender;
    //     address payable _seller = _demand.owner;
    //     address(_seller).transfer(msg.value);

    //     //Trigger an event
    //     emit EnergyDemandFulfilled(demandCount, _demand.quantity, _demand.price, _buyer, msg.sender, true);
    // } 

function fulfillEnergyDemand(uint _id) public payable {
    require(_id > 0 && _id <= demandCount, "Invalid demand ID");
    EnergyDemand storage demand = energyDemands[_id];
    require(!demand.purchased, "Demand already fulfilled");
    require(msg.value >= demand.price, "Insufficient funds");

    // Store the original owner
    address payable originalOwner = demand.owner;

    // Transfer the energy from the demand to the buyer
    demand.owner = msg.sender;
    demand.purchased = true;

    // Transfer the demand price to the seller
    originalOwner.transfer(demand.price);

    // Trigger an event
    emit EnergyDemandFulfilled(
        _id,
        demand.quantity,
        demand.price,
        msg.sender,
        originalOwner,
        true
    );
}  
}


