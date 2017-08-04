import React from 'react';
import { Redirect } from 'react-router-dom';
const remote = window.require('electron').remote;
const { getLoginUrl } = remote.require('./main.js');

const Login = ({ token }) =>
  <div>
    {token.length !== 0
      ? <Redirect to="/records" />
      : <a href={getLoginUrl()}>
          <button>Login with Oauth</button>
        </a>}
  </div>;

export default Login;
