import React, { Component } from 'react';
import { HashRouter, Route, Link, } from 'react-router-dom';
import ApiViewer from './api-viewer';
import './App.css';
// eslint-disable-next-line
const remote = window.require('electron').remote;
const { getLoginUrl, loadSplatnet, } = remote.require('./main.js');


const NavigationButtons = () => (
  <div className="App">
    <div className="App-header">
      <h2>Splatnet Testing</h2>
    </div>
    <p>
      <a href={getLoginUrl()}><button>Login with Oauth</button></a>
    </p>
    <p>
        <button onClick={() => loadSplatnet()}>Open Splatnet 2</button>
    </p>
    <p>
        <Link to="/test"><button>Custom Web Pages</button></Link>
    </p>
  </div>
)

class App extends Component {
  render() {
    return (
      <HashRouter>
        <div>
          <Route path="/" exact component={NavigationButtons} />
          <Route path="/test" component={ApiViewer} />
        </div>
      </HashRouter>
    );
  }
}

export default App;
