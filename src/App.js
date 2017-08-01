import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import ApiViewer from './api-viewer';
import logo from './logo.svg';
import './App.css';
import auth from './auth.json';
// eslint-disable-next-line
const remote = window.require('electron').remote;
const loadSplatnetWithSessionToken = remote.require('./main.js').loadSplatnetWithSessionToken;

function getLoginUrl() {
    const params = {
        state: 'gEwdiqtwhaXLhBtWUKhPZPhaqZvcUhDxrlwKNXYDseGSidvgNk',
        redirect_uri: 'npf71b963c1b7b6d119://auth&client_id=71b963c1b7b6d119',
        scope: 'openid%20user%20user.birthday%20user.mii%20user.screenName',
        response_type: 'session_token_code',
        session_token_code_challenge: 'iCzLJAsqbxVesq_sUAb3SwmyobMO9v9DgFtyS7HXn5g',
        session_token_code_challenge_method: 'S256',
        theme: 'login_form',
    };

    const arrayParams = [];
    for (var key in params) {
        if (!params.hasOwnProperty(key)) continue;
        arrayParams.push(`${key}=${params[key]}`);
    }

    const stringParams = arrayParams.join('&');

    return `https://accounts.nintendo.com/connect/1.0.0/authorize?${stringParams}`;
}

const NavigationButtons = () => (
  <div className="App">
    <div className="App-header">
      <h2>Splatnet Testing</h2>
    </div>
    <p>
      <a href={getLoginUrl()}><button>Login with Oauth</button></a>
    </p>
    <p>
        <button onClick={() => loadSplatnetWithSessionToken(auth.session_token)}>Login from Session Token</button>
    </p>
    <p>
        <button>Custom Web Pages</button>
    </p>
  </div>
)

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Route path="/" exact component={NavigationButtons} />
          <Route path="/test" component={ApiViewer} />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
