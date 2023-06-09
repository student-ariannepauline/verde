import React, { Component } from 'react';
import Web3 from 'web3';
import Marketplace from '../abis/Marketplace.json';
import Navbar from './Navbar';
import Main from './Main';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: '',
      energyCount: 0,
      energies: [],
      demandCount: 0,
      energyDemands: [],
      // userEnergy: 0,
      totalEnergy: 170,
      loading: true,
    };

    this.sellEnergy = this.sellEnergy.bind(this);
    this.purchaseEnergy = this.purchaseEnergy.bind(this);
    this.createEnergyDemand = this.createEnergyDemand.bind(this);
    this.fulfillEnergyDemand = this.fulfillEnergyDemand.bind(this);
  }

  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3;
    // Load account
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });
    const networkId = await web3.eth.net.getId();
    const networkData = Marketplace.networks[networkId];
    if (networkData) {
      const marketplace = new web3.eth.Contract(Marketplace.abi, networkData.address);
      this.setState({ marketplace });
      const energyCount = await marketplace.methods.energyCount().call();
      this.setState({ energyCount });
      const demandCount = await marketplace.methods.demandCount().call();
      this.setState({ demandCount });
      // Load products
      for (let i = 1; i <= energyCount; i++) {
        const energy = await marketplace.methods.energies(i).call();
        this.setState({
          energies: [...this.state.energies, energy],
        });
      }

      // Load EnergyDemands
      for (let j = 1; j <= demandCount; j++) {
        const energyDemand = await marketplace.methods.energyDemands(j).call();
        this.setState({
          energyDemands: [...this.state.energyDemands, energyDemand],
        });
      }
      this.setState({ loading: false });
    } else {
      window.alert('Marketplace contract not deployed to detected network.');
    }
  }

  sellEnergy(quantity, price) {
    this.setState({ loading: true });
    this.state.marketplace.methods
      .sellEnergy(quantity, price)
      .send({ from: this.state.account })
      .once('receipt', (receipt) => {
        this.setState({ loading: false });
      });
  }

  purchaseEnergy(id, price) {
    this.setState({ loading: true });
    this.state.marketplace.methods
      .purchaseEnergy(id)
      .send({ from: this.state.account, value: price })
      .once('receipt', (receipt) => {
        this.setState({ loading: false });
      });
  }

  createEnergyDemand(quantity, price) {
    this.setState({ loading: true });
    this.state.marketplace.methods
      .createEnergyDemand(quantity, price)
      .send({ from: this.state.account })
      .once('receipt', (receipt) => {
        this.setState({ loading: false });
      });
  }

  fulfillEnergyDemand(id, price) {
    this.setState({ loading: true });
    this.state.marketplace.methods
      .fulfillEnergyDemand(id)
      .send({ from: this.state.account, value: price })
      .once('receipt', (receipt) => {
        this.setState({ loading: false });
      });
  }

  // componentDidMount() {
  //   this.calculateUserEnergy();
  // }

  // calculateUserEnergy() {
  //   const { totalEnergy, quantity } = this.state;
  //   const userEnergy = totalEnergy - quantity;
  //   this.setState({ userEnergy });
  // }




  render() {
    return (
      <div>
        {/* Navbar component */}
        <Navbar />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex">
              {this.state.loading ? (
                <div id="loader" className="text-center">
                  <p className="text-center">Loading...</p>
                </div>
              ) : (
                <Main
                // userEnergy={this.state.userEnergy}
                totalEnergy={this.state.totalEnergy}
                account={this.state.account}
                  energies={this.state.energies}
                  energyDemands={this.state.energyDemands}
                  sellEnergy={this.sellEnergy}
                  purchaseEnergy={this.purchaseEnergy}
                  createEnergyDemand={this.createEnergyDemand}
                  fulfillEnergyDemand={this.fulfillEnergyDemand}
                />
              )}
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
