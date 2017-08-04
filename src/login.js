import React from 'react';
const remote = window.require('electron').remote;
const { getLoginUrl } = remote.require('./main.js');

const Login = ({ token }) =>
  <div>
    <a href={getLoginUrl()}>
      <button>Login with Oauth</button>
    </a>
  </div>;

export default Login;
