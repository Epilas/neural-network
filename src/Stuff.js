import React, { Component } from "react";
import "./stuff.css";
import Loader from 'react-loader-spinner'
import {Network} from "./network.js";
import {drawNetwork} from "./drawNetwork.js"

//const network = new Network([2,4,1])
let network
const x = [[0,0],[0,1],[1,0],[1,1]]
const y = [[0],[0],[0],[1]]

class Stuff extends Component {
  constructor(props) {
    super(props)
    this.state = {epochs: 1,input: "",output: "", netSizes: "", loading: false}

    this.handleTrain = this.handleTrain.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handlePredict = this.handlePredict.bind(this)
    this.handleCreateNetwork = this.handleCreateNetwork.bind(this)
  }

  handleTrain() {
    console.log(network)
    network.train({ input: x, output: y, epochs: this.state.epochs})
    drawNetwork(network,800,500,22)
  }

  handlePredict() {
    let inputs = this.state.input.split(',')
    let outputs = network.predict(inputs)
    this.setState({output: outputs});
  }

  handleCreateNetwork() {
    this.setState({...this.state, loading: true})
    setTimeout(() =>{}, 1000)
    let sizes = this.state.netSizes.split(',').map(x => +x)
    let net = new Network(sizes)
    network = net
    console.log(network)
    drawNetwork(network,800,500,22);
    this.setState({...this.state,loading: false})
  }

  handleChange(evt) {
    const value = evt.target.value;
    this.setState({
      ...this.state,
      [evt.target.name]: value
    });
  }

  componentDidMount() {
    //drawNetwork(network,800,500,22);
  }

  render() {
    return (
    <div>
      <div style={{display: "inline-block"}}><input type="text" name="netSizes" value={this.state.netSizes} onChange={this.handleChange}></input> net sizes <button onClick={this.handleCreateNetwork}>Create network</button> </div><div style={{display: "inline-block", margin:"5px", position: "relative", top: "6px"}}>
      {this.state.loading ? <Loader type="Oval" color="#00BFFF" height={22} width={22} />: ""}</div><br/>
      <input type="number" name="epochs" value={this.state.epochs} onChange={this.handleChange}></input> epochs <button onClick={this.handleTrain}>Train</button> <br/>
      <input type="text" name="input" value={this.state.input} onChange={this.handleChange}></input> inputs <button onClick={this.handlePredict}>Predict</button> <br/>
      {this.state.output!==""? <span>Wynik: {this.state.output}</span>:""}
      <div className="neuralNetwork">
      </div>
    </div>  
    );
  }
}
 
export default Stuff;