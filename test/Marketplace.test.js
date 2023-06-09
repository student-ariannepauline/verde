// const { assert, expect } = require('chai');
// const Marketplace = artifacts.require('./Marketplace.sol');

// require('chai')
//   .use(require('chai-as-promised'))
//   .should();

// contract('Marketplace', ([deployer, seller, buyer, demander]) => {
//   let marketplace;

//   before(async () => {
//     marketplace = await Marketplace.deployed();
//   });

//   describe('Deployment', async () => {
//     it('Smart contract deploys successfully', async () => {
//       const address = await marketplace.address;
//       assert.notEqual(address, 0x0);
//       assert.notEqual(address, '');
//       assert.notEqual(address, null);
//       assert.notEqual(address, undefined);
//     });

//     it('Smart contract has a valid name', async () => {
//       const name = await marketplace.name();
//       assert.equal(name, 'VerdePay');
//     });
//   });

//   describe('Energy Transactions', async () => {
//     let result, resultDemand, energyCount, demandCount;

//     before(async () => {
//       result = await marketplace.sellEnergy('5', web3.utils.toWei('1', 'ether'), { from: seller });
//       resultDemand = await marketplace.createEnergyDemand('5', web3.utils.toWei('1', 'ether'), { from: demander });
//       energyCount = (await marketplace.energyCount()).toNumber();
//       demandCount = (await marketplace.demandCount()).toNumber();
//     });

//     it('Allows users to create energy listings', async () => {
//       // SUCCESS
//       assert.equal(energyCount, 1);

//       // Check logs
//       const event = result.logs[0].args;
//       assert.equal(event.id.toNumber(), energyCount, 'id is correct');
//       assert.equal(event.quantity.toNumber(), 5, 'quantity is correct');
//       assert.equal(event.price.toString(), web3.utils.toWei('1', 'ether'), 'price is correct');
//       assert.equal(event.owner, seller, 'owner is correct');
//       assert.equal(event.purchased, false, 'purchased is correct');

//       // FAILURE: Product must have a quantity
//       await marketplace.sellEnergy('', web3.utils.toWei('1', 'ether'), { from: seller }).should.be.rejected;
//       // FAILURE: Product must have a price
//       await marketplace.sellEnergy('5', 0, { from: seller }).should.be.rejected;
//     });

//     it('Successfully lists user energy listings', async () => {
//       const energy = await marketplace.energies(energyCount);
//       assert.equal(energy.id.toNumber(), energyCount, 'id is correct');
//       assert.equal(energy.quantity.toNumber(), 5, 'quantity is correct');
//       assert.equal(energy.price.toString(), web3.utils.toWei('1', 'ether'), 'price is correct');
//       assert.equal(energy.owner, seller, 'owner is correct');
//       assert.equal(energy.purchased, false, 'purchased is correct');
//     });

//     it('Successfully makes energy transactions', async () => {
//       // Track seller balance before purchase
//       let oldSellerBalance = await web3.eth.getBalance(seller);
//       oldSellerBalance = new web3.utils.BN(oldSellerBalance);

//       // SUCCESS: Buyer purchases energy
//       result = await marketplace.purchaseEnergy(energyCount, { from: buyer, value: web3.utils.toWei('1', 'ether') });

//       // Check logs
//       const event = result.logs[0].args;
//       assert.equal(event.id.toNumber(), energyCount, 'id is correct');
//       assert.equal(event.quantity.toNumber(), 5, 'quantity is correct');
//       assert.equal(event.price.toString(), web3.utils.toWei('1', 'ether'), 'price is correct');
//       assert.equal(event.owner, buyer, 'owner is correct');
//       assert.equal(event.purchased, true, 'purchased is correct');

//       // Check that seller received payment
//       let newSellerBalance = await web3.eth.getBalance(seller);
//       newSellerBalance = new web3.utils.BN(newSellerBalance);

//       let price = web3.utils.toWei('1', 'ether');
//       price = new web3.utils.BN(price);

//       const expectedBalance = oldSellerBalance.add(price);

//       assert.equal(newSellerBalance.toString(), expectedBalance.toString());

//       // FAILURE: Buyer tries to buy a product that does not exist
//       await marketplace.purchaseEnergy(99, { from: buyer, value: web3.utils.toWei('1', 'ether') }).should.be.rejected;
//       // FAILURE: Buyer tries to buy without enough ether
//       await marketplace.purchaseEnergy(energyCount, { from: buyer, value: web3.utils.toWei('0.5', 'ether') }).should.be.rejected;
//       // FAILURE: Deployer tries to buy the product
//       await marketplace.purchaseEnergy(energyCount, { from: deployer, value: web3.utils.toWei('1', 'ether') }).should.be.rejected;
//       // FAILURE: Buyer tries to buy the same product again
//       await marketplace.purchaseEnergy(energyCount, { from: buyer, value: web3.utils.toWei('1', 'ether') }).should.be.rejected;
//     });

//     it('Allows users to create energy demands', async () => {
//       assert.equal(demandCount, 1);

//       // Check logs
//       const event = resultDemand.logs[0].args;
//       assert.equal(event.id.toNumber(), demandCount, 'id is correct');
//       assert.equal(event.quantity.toNumber(), 5, 'quantity is correct');
//       assert.equal(event.price.toString(), web3.utils.toWei('1', 'ether'), 'price is correct');
//       assert.equal(event.demander, demander, 'demander is correct');
//       assert.equal(event.purchased, false, 'purchased is correct');

//       // FAILURE: Product must have a quantity
//       await marketplace.createEnergyDemand('', web3.utils.toWei('1', 'ether'), { from: demander }).should.be.rejected;
//       // FAILURE: Product must have a price
//       await marketplace.createEnergyDemand('5', 0, { from: demander }).should.be.rejected;
//     });

//     it('Successfully lists user energy demands', async () => {
//       const demand = await marketplace.energyDemands(demandCount);
//       assert.equal(demand.id.toNumber(), demandCount, 'id is correct');
//       assert.equal(demand.quantity.toNumber(), 5, 'quantity is correct');
//       assert.equal(demand.price.toString(), web3.utils.toWei('1', 'ether'), 'price is correct');
//       assert.equal(demand.demander, demander, 'demander is correct');
//       assert.equal(demand.purchased, false, 'purchased is correct');
//     });

//     it('Successfully fulfills energy demands', async () => {
//       // SUCCESS: Seller fulfills energy demand
//       resultDemand = await marketplace.fulfillEnergyDemand(demandCount, { from: seller, value: web3.utils.toWei('1', 'ether') });
    
//       // Check logs
//       const event = resultDemand.logs[0].args;
//       assert.equal(event.id.toNumber(), demandCount, 'id is correct');
//       assert.equal(event.quantity.toNumber(), 5, 'quantity is correct');
//       assert.equal(event.price.toString(), web3.utils.toWei('1', 'ether'), 'price is correct');
//       assert.equal(event.demander, demander, 'demander is correct');
//       assert.equal(event.purchased, true, 'purchased is correct');
    
//       // FAILURE: Seller tries to fulfill a demand that does not exist
//       await marketplace.fulfillEnergyDemand(99, { from: demander, value: web3.utils.toWei('1', 'ether') }).should.be.rejected;
//       // FAILURE: Seller tries to fulfill a demand without enough ether
//       await marketplace.fulfillEnergyDemand(demandCount, { from: demander, value: web3.utils.toWei('0.5', 'ether') }).should.be.rejected;
//       // // FAILURE: Seller tries to fulfill the same demand again
//       await marketplace.fulfillEnergyDemand(demandCount, { from: demander, value: web3.utils.toWei('1', 'ether') }).should.be.rejected;
//     });

//     // it("should add energy values correctly", async () => {
//     //   // Create a sample Energy struct
//     //   const energy = {
//     //     id: 1,
//     //     quantity: 50,
//     //     price: 10,
//     //     owner: seller,
//     //     purchased: true,
//     //   };
  
//     //   // Create a sample UserEnergy struct
//     //   const userEnergy = {
//     //     id: 1,
//     //     amount: 100,
//     //     energyOwner: buyer,
//     //     purchased: true,
//     //   };
  
//     //   // Call the addEnergyValues function
//     //   const combinedData = await await marketplace.addEnergyValues(energy, userEnergy);
  
//     //   // Assert the expected result using Chai assertions
//     //   const expectedTotalQuantity = 150;
//     //   assert.equal(combinedData.totalQuantity, expectedTotalQuantity, "Total quantity should match the expected value");
//     // });
//   });


const { assert } = require('chai');

const Marketplace = artifacts.require('./Marketplace.sol');

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('Marketplace', ([deployer, seller, buyer]) => {
    let marketplace

    before(async () => {
        marketplace = await Marketplace.deployed()
    })

    describe('Deployment', async () => {
        it('Smart contract deploys successfully', async () => {
            const address = await marketplace.address
            assert.notEqual(address, 0x0)
            assert.notEqual(address, '')
            assert.notEqual(address, null)
            assert.notEqual(address, undefined)
        })

        it('Smart contract has a valid name', async () => {
            const name = await marketplace.name()
            assert.equal(name, 'VerdePay')
        })
    })

    describe('Energy Transactions', async () => {
        let result, energyCount, resultDemand, demandCount

        before(async () => {
            result = await marketplace.sellEnergy('5', web3.utils.toWei('1', 'Ether'), { from: seller})
            energyCount = await marketplace.energyCount()

            resultDemand = await marketplace.createEnergyDemand('5', web3.utils.toWei('1', 'Ether'), { from: buyer})
            demandCount = await marketplace.demandCount()

        })

        it('Allows users to create energy listings', async () => {
            // SUCCESS
            assert.equal(energyCount, 1)

            //check logs
            const event = result.logs[0].args
            assert.equal(event.id.toNumber(), energyCount.toNumber(), 'id is correct')
            assert.equal(event.quantity, '5', 'quantity is correct')
            assert.equal(event.price, '1000000000000000000', 'price is correct')
            assert.equal(event.owner, seller, 'is correct')
            assert.equal(event.purchased, false, 'purchased is correct')

            //FAILURE: Product must have a quantity
            await await marketplace.sellEnergy('', web3.utils.toWei('1', 'Ether'), { from: seller}).should.be.rejected;
            //FAILURE: Product must have a price
            await await marketplace.sellEnergy('5', 0, { from: seller}).should.be.rejected;
        })
        
        it('Successfully lists user energy listings', async () => {
            const energy = await marketplace.energies(energyCount)
            assert.equal(energy.id.toNumber(), energyCount.toNumber(), 'id is correct')
            assert.equal(energy.quantity, '5', 'quantity is correct')
            assert.equal(energy.price, '1000000000000000000', 'price is correct')
            assert.equal(energy.owner, seller, 'is correct')
            assert.equal(energy.purchased, false, 'purchased is correct')
        })

        it('Successfully makes energy transactions', async () => {
            //track seller balance before purchase
            let oldSellerBalance
            oldSellerBalance = await web3.eth.getBalance(seller)
            oldSellerBalance = new web3.utils.BN(oldSellerBalance)

            //SUCCESS buyer purchased energy
            result = await marketplace.purchaseEnergy(energyCount, { from: buyer, value: web3.utils.toWei('1', 'Ether')})

            //check logs
            const event = result.logs[0].args
            assert.equal(event.id.toNumber(), energyCount.toNumber(), 'id is correct')
            assert.equal(event.quantity, '5', 'quantity is correct')
            assert.equal(event.price, '1000000000000000000', 'price is correct')
            assert.equal(event.owner, buyer, 'is correct')
            assert.equal(event.purchased, true, 'purchased is correct')

            //Check that seller received payment
            let newSellerBalance
            newSellerBalance = await web3.eth.getBalance(seller)
            newSellerBalance = new web3.utils.BN(newSellerBalance)

            let price
            price = web3.utils.toWei('1', 'Ether')
            price = new web3.utils.BN(price)

            const expectedBalance = oldSellerBalance.add(price)

            assert.equal(newSellerBalance.toString(), expectedBalance.toString())

            //FAILURE: Buyer tries to buy a product that does not exist
            await marketplace.purchaseEnergy(99, { from: buyer, value: web3.utils.toWei('1', 'Ether')}).should.be.rejected;
            //FAILURE: Buyer tries to buy without enough ether
            await marketplace.purchaseEnergy(energyCount, { from: buyer, value: web3.utils.toWei('0.5', 'Ether')}).should.be.rejected;
            //FAILURE: Deployer tries to buy the product
            await marketplace.purchaseEnergy(energyCount, { from: deployer, value: web3.utils.toWei('1', 'Ether')}).should.be.rejected;
            //FAILURE: Buyer tries to buy the same product
            await marketplace.purchaseEnergy(energyCount, { from: buyer, value: web3.utils.toWei('1', 'Ether')}).should.be.rejected;
        
        })

        it('Allows users to create energy demands', async () => {
          // SUCCESS
          assert.equal(demandCount, 1)

          //check logs
          const event = resultDemand.logs[0].args
          assert.equal(event.id.toNumber(), demandCount.toNumber(), 'id is correct')
          assert.equal(event.quantity, '5', 'quantity is correct')
          assert.equal(event.price, '1000000000000000000', 'price is correct')
          assert.equal(event.owner, buyer, 'is correct')
          assert.equal(event.purchased, false, 'purchased is correct')

          //FAILURE: Product must have a quantity
          await await marketplace.createEnergyDemand('', web3.utils.toWei('1', 'Ether'), { from: buyer}).should.be.rejected;
          //FAILURE: Product must have a price
          await await marketplace.createEnergyDemand('5', 0, { from: buyer}).should.be.rejected;
      })

      it('Successfully lists user energy demand listings', async () => {
        const demand = await marketplace.energyDemands(demandCount)
        assert.equal(demand.id.toNumber(), demandCount.toNumber(), 'id is correct')
        assert.equal(demand.quantity, '5', 'quantity is correct')
        assert.equal(demand.price, '1000000000000000000', 'price is correct')
        assert.equal(demand.owner, buyer, 'is correct')
        assert.equal(demand.purchased, false, 'purchased is correct')
    })

      it('Successfully fulfills energy demands', async () => {
        resultDemand = await marketplace.fulfillEnergyDemand(demandCount, { from: seller, value: web3.utils.toWei('1', 'Ether')})

        //check logs
        const event = resultDemand.logs[0].args
        assert.equal(event.id.toNumber(), demandCount.toNumber(), 'id is correct')
        assert.equal(event.quantity, '5', 'quantity is correct')
        assert.equal(event.price, '1000000000000000000', 'price is correct')
        assert.equal(event.purchased, true, 'purchased is correct')


        //FAILURE: Seller tries to fulfill an energy demand that does not exist
        await marketplace.fulfillEnergyDemand(99, { from: seller, value: web3.utils.toWei('1', 'Ether')}).should.be.rejected;
        //FAILURE: Seller tries to buy without enough energy
        // await marketplace.fulfillEnergyDemand(demandCount, { from: seller, value: ('', '')}).should.be.rejected;
        
        //FAILURE: Seller tries to fulfill the same energy demand
        await marketplace.fulfillEnergyDemand(demandCount, { from: seller, value: web3.utils.toWei('1', 'Ether')}).should.be.rejected;
    })
  })
})