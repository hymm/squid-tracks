import React, { Component } from 'react';
import { Router, Route } from 'react-router-dom';
import ApiViewer from './api-viewer';
import createHashHistory from 'history/createHashHistory';
import { screenview } from './analytics';
import Schedule from './schedule';
import Records from './records';
import Meta from './meta';
import Results from './results';
import Settings from './settings';
import Navigation from './navigation';
import About from './about';
import Login from './login';

import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
// eslint-disable-next-line
const { ipcRenderer } = require('electron');

const history = createHashHistory();
history.listen(location => {
  screenview(`${location.pathname}${location.search}${location.hash}`);
});

const Routes = ({ token, logoutCallback }) =>
  <div>
    <Navigation />
    <Route path="/" exact component={About} />
    <Route path="/testApi" component={ApiViewer} />
    <Route path="/schedule" component={Schedule} />
    <Route path="/records" component={Records} />
    <Route path="/results" component={Results} />
    <Route path="/meta" component={Meta} />
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
    screenview('Start');
  }

  getSessionToken = () => {
    this.setState({ sessionToken: ipcRenderer.sendSync('getSessionToken') });
  };

  render() {
    return (
      <Router history={history}>
        {this.state.sessionToken.length !== 0
          ? <Routes
              token={this.state.sessionToken}
              logoutCallback={this.getSessionToken}
            />
          : <Login />}
      </Router>
    );
  }
}

export default App;
