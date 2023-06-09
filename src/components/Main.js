import React, { Component } from 'react';
import { Button, Card, CardBody, CardTitle, CardText, Progress, Table, Container, Row, Col } from 'reactstrap';

class Main extends Component {
  render() {
    return (
      <div id="content" className="container">
        <Container
        fluid>
        <Row>
            <br></br>
            <br></br>
        </Row>
        <Row>
            <Col
            md={{
                offset: 3,
                size: 6
            }}
            sm="12"
            >
            <Card>
                    <CardBody>
                    <CardTitle tag="h5">
                    Welcome User, {this.props.account}
                    </CardTitle>
                    <CardText>
                      Your total energy is {this.props.totalEnergy} kW
                    </CardText>
                    </CardBody>
                  </Card>

                  <Progress
                    animated
                    className="my-3"
                    color="success"
                    striped
                    value={this.props.totalEnergy}
                    max="300"
                  />
            </Col>
        </Row>
        <Row>
            <br></br>
            <br></br>
        </Row>
        </Container>
        <Container fluid>
        <Row sm="6">
            <Col
            >
                <h2>Sell Energy</h2>
                            <form onSubmit={(event) => {
                                event.preventDefault()
                                const quantity = (this.energyQuantity.value.toString())
                                const price = window.web3.utils.toWei(this.energyPrice.value.toString(), 'Ether')
                                this.props.sellEnergy(quantity, price)
                            }}>
                            <div className="input-group mr-sm-2">
                                <span class="input-group-text">Energy</span>
                                <input
                                    id="energyQuantity"
                                    type="number"
                                    min="1" max="30"
                                    ref={(input) => { this.energyQuantity = input }}
                                    className="form-control"
                                    placeholder="1 kw"
                                    required />
                                <span class="input-group-text">kW</span>
                            </div>
    
                            <div className="input-group mr-sm-2">
                                <span class="input-group-text">Energy Price</span>
                                <input
                                    id="energyPrice"
                                    type="number"
                                    min="1" max="30"
                                    ref={(input) => { this.energyPrice = input }}
                                    className="form-control"
                                    placeholder="1 Eth"
                                    required />
                                <span class="input-group-text">Eth</span>
                            </div>
                        <Button color="success" type="submit" className="btn btn-primary">Sell Energy</Button>
                    </form>
                </Col>
                <Col
            xs="6"
            >
            <h2>Demand Energy</h2>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const quantity = (this.energyDemandQuantity.value.toString());
            const price = window.web3.utils.toWei(this.energyDemandPrice.value.toString(), 'Ether');
            this.props.createEnergyDemand(quantity, price);
          }}
        >
          <div className="input-group mr-sm-2">
            <span className="input-group-text">Energy</span>
            <input
              id="demandQuantity"
              type="number"
              min="1"
              max="30"
              ref={(input) => {
                this.energyDemandQuantity = input;
              }}
              className="form-control"
              placeholder="1 kw"
              required
            />
            <span className="input-group-text">kW</span>
          </div>

          <div className="input-group mr-sm-2">
            <span className="input-group-text">Energy Price</span>
            <input
              id="demandPrice"
              type="number"
              min="1"
              max="30"
              ref={(input) => {
                this.energyDemandPrice = input;
              }}
              className="form-control"
              placeholder="1 Eth"
              required
            />
            <span className="input-group-text">Eth</span>
          </div>
          <Button color="success" type="submit" className="btn btn-primary">
            Demand Energy
          </Button>
        </form>
            </Col>
        </Row>
        <Row>
            <br></br>
            <br></br>
        </Row>
        <Row xs="2">
        <Col
                xs="6"
                >
                <h2>Buy Energy</h2>
            <Table bordered>
                <thead>
                <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Owner</th>
                    <th></th>
                </tr>
                </thead>
                <tbody id="energyList">
                {this.props.energies.map((energy, key) => {
                    return (
                    <tr key={key}>
                        <th scope="row">{energy.id.toString()}</th>
                        <td>{(energy.quantity.toString())} kW</td>
                        <td>{window.web3.utils.fromWei(energy.price.toString(), 'Ether')} Eth</td>
                        <td>{energy.owner}</td>
                        <td>
                        {!energy.purchased ? (
                            <Button
                            color='success'
                            name={energy.id}
                            value={energy.price}
                            onClick={(event) => {
                                this.props.purchaseEnergy(event.target.name, event.target.value);
                            }}
                            >
                            Buy
                            </Button>
                        ) : (
                            <Button
                                color="success"
                                disabled
                            >
                                Purchased
                            </Button>
                        )}
                        </td>
                    </tr>
                    );
                })}
                </tbody>
            </Table>
            </Col>
            
            <Col
            xs="6"
            >
             <h2>Fulfill Energy Demand</h2>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Price</th>
                <th scope="col">Owner</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              {this.props.energyDemands.map((demand, key) => {
                return (
                  <tr key={key}>
                    <th scope="row">{demand.id.toString()}</th>
                    <td>{(demand.quantity.toString())} kW</td>
                    <td>{window.web3.utils.fromWei(demand.price.toString(), 'Ether')} Eth</td>
                    <td>{demand.owner}</td>
                    <td>
                      {!demand.purchased ? (
                        <Button
                          color='success'
                          name={demand.id}
                          value={demand.price}
                          onClick={(event) => {
                            this.props.fulfillEnergyDemand(event.target.name, event.target.value);
                          }}
                        >
                          Fulfill
                        </Button>
                      ) : (
                            <Button
                                color="success"
                                disabled
                            >
                                Fulfilled
                            </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
            </Col>
        </Row>
        </Container>
      </div>
    );
  }
}

export default Main;


// import React, { Component } from 'react';

// class Main extends Component {

//   render() {
//     return (
//         <div id="content" class="container">
//           <div class="row justify-content-between">
//           <div class="col-6">
//         <h1>Add Energy</h1>
//         <form onSubmit={(event) => {
//           event.preventDefault()
//           const quantity = this.energyQuantity.value
//           const price = window.web3.utils.toWei(this.energyPrice.value.toString(), 'Ether')
//           this.props.sellEnergy(quantity, price)
//         }}>
//           <div className="input-group mr-sm-2">
//           <span class="input-group-text">Energy</span>
//             <input
//               id="energyQuantity"
//               type="number"
//               min="1" max="30"
//               ref={(input) => { this.energyQuantity = input }}
//               className="form-control"
//               placeholder="1 kw"
//               required />
//             <span class="input-group-text">kW</span>
//           </div>

//           <div className="input-group mr-sm-2">
//             <span class="input-group-text">Energy Price</span>
//             <input
//               id="energyPrice"
//               type="number"
//               min="1" max="30"
//               ref={(input) => { this.energyPrice = input }}
//               className="form-control"
//               placeholder="1 Eth"
//               required />
//             <span class="input-group-text">Eth</span>
//           </div>
//           <button type="submit" className="btn btn-primary">Sell Energy</button>
//         </form>
//         </div>
//         <div class="col-6">
//         <h2>Buy Energy</h2>
//         <table className="table">
//           <thead>
//             <tr>
//               <th scope="col">#</th>
//               <th scope="col">Quantity</th>
//               <th scope="col">Price</th>
//               <th scope="col">Owner</th>
//               <th scope="col"></th>
//             </tr>
//           </thead>
//           <tbody id="energyList">
//             { this.props.energies.map((energy, key) => {
//                 return(
//                 <tr key={key}>
//                     <th scope="row">{energy.id.toString()}</th>
//                     <td>{energy.quantity.toString()} kW</td>
//                     <td>{window.web3.utils.fromWei(energy.price.toString(), 'Ether')} Eth</td>
//                     <td>{energy.owner}</td>
//                     <td> { !energy.purchased
//                     ? <button
//                         name={energy.id}
//                         value={energy.price}
//                         onClick={(event) => {
//                             this.props.purchaseEnergy(event.target.name, event.target.value)
//                         }}
//                         >
//                         Buy
//                         </button>
//                     : <p> Purchased </p>
//                     }</td>
//                   </tr>
//                 )
//             })}           
//           </tbody>
//         </table>
//       </div>
//           <div class="row justify-content-between">
//               <div class="col-6">
//             <h1>Add Energy Demand</h1>
//             <form onSubmit={(event) => {
//               event.preventDefault()
//               const quantity = this.demandQuantity.value
//               const price = window.web3.utils.toWei(this.demandPrice.value.toString(), 'Ether')
//               this.props.createEnergyDemand(quantity, price)
//             }}>
//               <div className="input-group mr-sm-2">
//               <span class="input-group-text">Energy</span>
//                 <input
//                   id="demandQuantity"
//                   type="number"
//                   min="1" max="30"
//                   ref={(input) => { this.demandQuantity = input }}
//                   className="form-control"
//                   placeholder="1 kw"
//                   required />
//                 <span class="input-group-text">kW</span>
//               </div>

//               <div className="input-group mr-sm-2">
//                 <span class="input-group-text">Energy Price</span>
//                 <input
//                   id="demandPrice"
//                   type="number"
//                   min="1" max="30"
//                   ref={(input) => { this.demandPrice = input }}
//                   className="form-control"
//                   placeholder="1 Eth"
//                   required />
//                 <span class="input-group-text">Eth</span>
//               </div>
//               <button type="submit" className="btn btn-primary">Demand Energy</button>
//             </form>
//             </div>
//             <div class="col-6">
//             <h2>Fulfill Energy Demand</h2>
//             <table className="table">
//               <thead>
//                 <tr>
//                   <th scope="col">#</th>
//                   <th scope="col">Quantity</th>
//                   <th scope="col">Price</th>
//                   <th scope="col">Owner</th>
//                   <th scope="col"></th>
//                 </tr>
//               </thead>
//               <tbody id="demandList">
//                 { this.props.energyDemands.map((demand, key) => {
//                     return(
//                     <tr key={key}>
//                         <th scope="row">{demand.id.toString()}</th>
//                         <td>{demand.quantity.toString()} kW</td>
//                         <td>{window.web3.utils.fromWei(demand.price.toString(), 'Ether')} Eth</td>
//                         <td>{demand.owner}</td>
//                         <td> { !demand.purchased
//                         ? <button
//                             name={demand.id}
//                             value={demand.price}
//                             onClick={(event) => {
//                                 this.props.fulfillEnergyDemand(event.target.name, event.target.value)
//                             }}
//                             >
//                             Fulfill
//                             </button>
//                         : <p> Fulfilled </p>
//                         }</td>
//                       </tr>
//                     )
//                 })}           
//               </tbody>
//             </table>
//           </div>
//           </div>
//             </div>

//       </div>
//     );
//   }
// }

// export default Main;
