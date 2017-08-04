import React, { Component } from 'react';
import { HashRouter, Route, Link } from 'react-router-dom';
import ApiViewer from './api-viewer';
import Records from './records';
import Navigation from './navigation';

import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
// eslint-disable-next-line
const remote = window.require('electron').remote;
const { getLoginUrl, loadSplatnet } = remote.require('./main.js');

const NavigationButtons = () =>
  <div className="App">
    <div className="App-header">
      <h2>Splatnet Testing</h2>
    </div>
    <p>
      <a href={getLoginUrl()}>
        <button>Login with Oauth</button>
      </a>
    </p>
    <p>
      <button onClick={() => loadSplatnet()}>Open Splatnet 2</button>
    </p>
  </div>;

class App extends Component {
  render() {
    return (
      <HashRouter>
        <div>
          <Navigation />
          <Route path="/" exact component={NavigationButtons} />
          <Route path="/testApi" component={ApiViewer} />
          <Route path="/records" component={Records} />
        </div>
      </HashRouter>
    );
  }
}

export default App;
