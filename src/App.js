import React, { Component } from 'react';
import { Router } from 'react-router-dom';
import createHashHistory from 'history/createHashHistory';
import { IntlProvider } from 'react-intl';
import Routes from './routes';
import messages from './messages';
import { screenview, uaException } from './analytics';
import log from 'electron-log';
import { ipcRenderer } from 'electron';
import SplatnetProvider from './splatnet-provider';

import './App.css';
import 'bootstrap/dist/css/bootstrap.css';

window.addEventListener('error', event => {
  const message = `UnhandledError in renderer: ${event.error}`;
  log.error(message);
  uaException(message);
});

window.addEventListener('unhandledrejection', event => {
  const message = `Unhandled Promise Rejection in renderer: ${event.reason}`;
  log.error(message);
  uaException(message);
});

const history = createHashHistory();
history.listen(location => {
  screenview(`${location.pathname}${location.search}${location.hash}`);
});

class App extends Component {
  state = {
    sessionToken: '',
    locale: 'en',
    loggedIn: false
  };

  componentDidMount() {
    this.getSessionToken();
    screenview('Start');
    this.setState({ locale: ipcRenderer.sendSync('getFromStore', 'locale') });
  }

  getSessionToken = () => {
    this.setState({
      sessionToken: ipcRenderer.sendSync('getSessionToken'),
      loggedIn: false
    });
  };

  setLocale = locale => {
    this.setState({ locale });
    ipcRenderer.sendSync('setUserLangauge', locale);
  };

  setLogin = loginStatus => {
    this.setState({ loggedIn: loginStatus });
  };

  render() {
    const { sessionToken, locale, loggedIn } = this.state;
    const message = messages[locale] || messages.en;
    return (
      <IntlProvider locale={locale} messages={message}>
        <SplatnetProvider>
          <Router history={history}>
            <Routes
              loggedIn={loggedIn}
              setLogin={this.setLogin}
              token={sessionToken}
              logoutCallback={this.getSessionToken}
              setLocale={this.setLocale}
              locale={locale}
            />
          </Router>
        </SplatnetProvider>
      </IntlProvider>
    );
  }
}

export default App;
