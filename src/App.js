import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import auth from './auth.json';
const remote = window.require('electron').remote;
const loadSplatnetWithSessionToken = remote.require('./main.js').loadSplatnetWithSessionToken;

function getLoginUrl() {
    const params = {
        state: 'gEwdiqtwhaXLhBtWUKhPZPhaqZvcUhDxrlwKNXYDseGSidvgNk',
        redirect_uri: 'npf71b963c1b7b6d119://auth&client_id=71b963c1b7b6d119',
        scope: 'openid%20user%20user.birthday%20user.mii%20user.screenName',
        // response_type: 'token',
        response_type: 'token',
        session_token_code_challenge: 'iCzLJAsqbxVesq_sUAb3SwmyobMO9v9DgFtyS7HXn5g',
        session_token_code_challenge_method: 'S256',
        // theme: 'login_form',
    };

    const arrayParams = [];
    for (var key in params) {
        if (!params.hasOwnProperty(key)) continue;
        arrayParams.push(`${key}=${params[key]}`);
    }

    const stringParams = arrayParams.join('&');

    return `https://accounts.nintendo.com/connect/1.0.0/authorize?${stringParams}`;
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          <a href={getLoginUrl()}>Login with Oauth</a>
        </p>
        <p className="App-intro">
            <button onClick={() => loadSplatnetWithSessionToken(auth.session_token)}>Login from Session Token</button>
        </p>
      </div>
    );
  }
}

export default App;
