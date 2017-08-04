import React, { Component } from 'react';
import { HashRouter, Route } from 'react-router-dom';
import ApiViewer from './api-viewer';
import Records from './records';
import Results from './results';
import Settings from './settings';
import Navigation from './navigation';
import Login from './login';

import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
// eslint-disable-next-line
const remote = window.require('electron').remote;
const { getSessionToken } = remote.require('./main.js');

class App extends Component {
  state = {
    sessionToken: ''
  };

  componentDidMount() {
    this.getSessionToken();
  }

  getSessionToken() {
    this.setState({ sessionToken: getSessionToken() });
  }

  render() {
    return (
      <HashRouter>
        <div>
          <Navigation />
          <Route
            path="/"
            exact
            component={() => <Login token={this.state.sessionToken} />}
          />
          <Route path="/testApi" component={ApiViewer} />
          <Route path="/records" component={Records} />
          <Route path="/results" component={Results} />
          <Route
            path="/settings"
            component={() => <Settings token={this.state.sessionToken} />}
          />
        </div>
      </HashRouter>
    );
  }
}

export default App;
