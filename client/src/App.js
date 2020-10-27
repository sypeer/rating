import React, { Component } from "react";
import RatingContract from "./contracts/Rating.json";
import getWeb3 from "./getWeb3";
import { Container, CardGroup, Button, Card, Jumbotron, Col, Table, Form, Row } from "react-bootstrap";

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'

class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null , input: '', registry: null, rating: '', ratingUser: '', ting: [] };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = RatingContract.networks[networkId];
      const instance = new web3.eth.Contract(
        RatingContract.abi,
        deployedNetwork && deployedNetwork.address,
      );
      
      const ratings = await instance.methods.getRatings(accounts[0]).call();
      
      const registry = await instance.methods.getUsers().call();
      
      this.setState({ web3, accounts, contract: instance, rating: ratings[1], ratingUser: ratings[0], registry: registry, ting: [ {id: ratings[0], score: ratings[1] }] });
      console.log(this.state.ting);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };


  registerUser = async () => {
    const { contract, accounts } = this.state;
    await contract.methods.registerUser().send({ from: accounts[0] });
  }

  handleChange = (e) => {
    const value = e.target.value;
    const { input } = this.state;
    console.log(input, e);
    this.setState({ input: value });
  }

  renderRegisteredUsers() {
    return this.state.registry.map((users, index) => {
      console.log({users});
      return (
        <Row style={{margin: '10px'}}>
          <Col xs={6}>
            {users} 
          </Col>
          <Col xs={4}>
            <Form.Control
              placeholder='Rating to give'
              name='input'
              type="number"
              onChange={this.handleChange}
            />
          </Col>
          <Col>
          <Button onClick={ async() => {
            console.log(users, this.state.input);
            await this.state.contract.methods.rateUser(
              users,
              this.state.input
              ).send({ 
                from: this.state.accounts[0]
                })
              }}>Submit Rating</Button>
          </Col>
        </Row>
      )
    })
  }

  renderRatingUsers() {
    return this.state.ratingUser.map((users, index) => {
      return (
        <Table>
          <tbody>
            <tr key={index}>
              <td>
                {users}
              </td>
            </tr>
          </tbody>
        </Table>
      )
    })
  }

  renderRatings() {
    return this.state.rating.map((rating, index) => {
      return (
        <Table>
          <tbody>
            <tr key={index}>
              <td>
                {rating}
              </td>
            </tr>
          </tbody>
        </Table>
      )
    })
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <Container className="text-center">
        <Jumbotron>
          <h1>Welcome to User Ratings</h1>
          <h2>Rate users and get rated!</h2>
          <Button onClick={this.registerUser}>Click to register!</Button>
        </Jumbotron>
          <CardGroup>
            <Card>
              <Card.Header>Rate User</Card.Header>
              <Card.Body>
                <div>{this.renderRegisteredUsers()}</div>
              </Card.Body>
            </Card>
          </CardGroup>
          
          <CardGroup>
              <Card>
                <Card.Header>User Rated</Card.Header>
                <div>{this.renderRatingUsers()}</div>
              </Card>
              <Card>
                <Card.Header>Rating Given</Card.Header>
                <div>{this.renderRatings()}</div>
              </Card>
          </CardGroup>
      </Container>
    );
  }
}

export default App;
