import React, { Component } from 'react';
import { Router } from 'react-router-dom';
import createHashHistory from 'history/createHashHistory';
import { IntlProvider } from 'react-intl';
import Routes from './routes';
import messages from './messages';

import { screenview } from './analytics';

import Login from './login';

import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
// eslint-disable-next-line
const { ipcRenderer } = require('electron');

const history = createHashHistory();
history.listen((location) => {
    screenview(`${location.pathname}${location.search}${location.hash}`);
});

class App extends Component {
  state = {
    sessionToken: '',
    locale: 'en',
  };

  componentDidMount() {
    this.getSessionToken();
    screenview('Start');
    this.setState({ locale: ipcRenderer.sendSync('getFromStore', 'locale') });
  }

  getSessionToken = () => {
    this.setState({ sessionToken: ipcRenderer.sendSync('getSessionToken') });
  };

  setLocale = (locale) => {
      this.setState({ locale });
      ipcRenderer.sendSync('setUserLangauge', locale);
  };

  render() {
    const { sessionToken, locale } = this.state;
    const message = messages[locale] || messages.en;
    return (
      <IntlProvider locale={locale} messages={message}>
          <Router history={history}>
            {sessionToken.length !== 0
              ? <Routes
                  token={sessionToken}
                  logoutCallback={this.getSessionToken}
                  setLocale={this.setLocale}
                />
              : <Login />}
          </Router>
      </IntlProvider>
    );
  }
}

export default App;
