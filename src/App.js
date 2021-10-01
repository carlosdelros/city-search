import React, { Component } from 'react';
import './App.css';

function CitySearchField(props) {

  const handleInputChange = (cityName) => {
    fetch(`https://ctp-zip-api.herokuapp.com/city/${cityName.toUpperCase()}`)
      .then(response => response.json())
      .then(zips => props.saveZips(zips))
  }

  return (
    <div>
      <b>Type a City Name</b>
      <input onChange={(event) => handleInputChange(event.target.value)}/>
    </div>
  )
}

function ZipList(props) {
  return (
    <div>
      <ul style={{display:'inline'}}>
        {props.zips.map(zip => <li>{zip}</li>)}
      </ul>
    </div>
  )
}

function StateInfo(props) {
  return <div>
    <h3>{props.state[0].State}</h3>
    <ul style={{display: 'inline-block'}}>
      {props.state.map(state => 
        <li style={{border: 'solid 1px black'}}>
          <p>Zip: {state.Zipcode}</p>
          <p>City: {state.City}</p>
        </li>
      )}
    </ul>
  </div>
}
class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      zips: [],
      groupedStates: {}
    }
  }

  saveZips(zips) {
    this.setState({zips})
    this.getStates()
  }

  getStates() {
    Promise.all(this.state.zips.map(zip => new Promise((resolve, reject) => {
      fetch(`http://ctp-zip-api.herokuapp.com/zip/${zip}`)
      .then(response => response.json())
      .then(citiesInfo => {
        citiesInfo.map(city => {
          let stateCopy = {...this.state}
          stateCopy.groupedStates[city.State] ? 
            stateCopy.groupedStates[city.State].push(city) :
            stateCopy.groupedStates[city.State] = [city];
          this.setState(stateCopy)
          return resolve()
        })
      })
    }))).then(() => {}).catch(()=> alert('An error Occured'))
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>City Search</h2>
        </div>
          <CitySearchField saveZips={(zips) => this.saveZips(zips)}/>
          <div>
            {this.state.zips.length ? <ZipList zips={this.state.zips}/> : <div>Empty</div>}
            {/* Uncomment for the extra credit part */}
            {/* {Object.keys(this.state.groupedStates).map(
              stateKey => <StateInfo state={this.state.groupedStates[stateKey]}/>
            )} */}
          </div>
      </div>
    );
  }
}

export default App;
