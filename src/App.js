import React, { Component } from 'react';
import { HashRouter, Route } from 'react-router-dom';
import ApiViewer from './api-viewer';
import Records from './records';
import Results from './results';
import Settings from './settings';
import Navigation from './navigation';
import About from './about';
import Login from './login';

import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
// eslint-disable-next-line
const { ipcRenderer } = window.require('electron');

const Routes = ({ token, logoutCallback }) =>
  <div>
    <Navigation />
    <Route path="/" exact component={About} />
    <Route path="/testApi" component={ApiViewer} />
    <Route path="/records" component={Records} />
    <Route path="/results" component={Results} />
    <Route
      path="/settings"
      component={() =>
        <Settings token={token} logoutCallback={logoutCallback} />}
    />
  </div>;

class App extends Component {
  state = {
    sessionToken: ''
  };

  componentDidMount() {
    this.getSessionToken();
  }

  getSessionToken = () => {
    this.setState({ sessionToken: ipcRenderer.sendSync('getSessionToken') });
  };

  render() {
    return (
      <HashRouter>
        {this.state.sessionToken.length !== 0
          ? <Routes
              token={this.state.sessionToken}
              logoutCallback={this.getSessionToken}
            />
          : <Login />}
      </HashRouter>
    );
  }
}

export default App;
