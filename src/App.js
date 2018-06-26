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
    loggedIn: false,
    loggingIn: false
  };

  componentDidMount() {
    // this.getSessionToken(true);
    this.checkLoginStatus();
    screenview('Start');
    this.setLocale(ipcRenderer.sendSync('getFromStore', 'locale'));
    this.setState({
      loggingIn: this.getLoggingInState(global.location.search)
    });
  }

  checkLoginStatus() {
    const cookie = ipcRenderer.sendSync('getFromStore', 'iksmCookie');
    ipcRenderer.sendSync('setIksmToken', cookie);
    if (ipcRenderer.sendSync('checkIksmValid')) {
      this.setState({ loggedIn: true });
      history.push('/');
      return;
    }

    if (ipcRenderer.sendSync('checkStoredSessionToken')) {
      this.setState({ loggedIn: true });
      history.push('/');
      return;
    }
  }

  getSessionToken = logout => {
    const token = ipcRenderer.sendSync('getFromStore', 'sessionToken');
    this.setState({
      sessionToken: token,
      loggedIn: false
    });
    if (!logout) {
      history.push('/');
    }
  };

  setLocale = locale => {
    this.setState({ locale });
    ipcRenderer.sendSync('setUserLangauge', locale);
  };

  setLogin = loginStatus => {
    this.setState({ loggedIn: loginStatus });
  };

  getLoggingInState(search) {
    const params = new URLSearchParams(search);
    const loggingIn = params.get('loggingIn');
    if (loggingIn === '1') {
      return true;
    }

    return false;
  }

  render() {
    const { sessionToken, locale, loggedIn, loggingIn } = this.state;
    const message = messages[locale] || messages.en;
    if (loggingIn) {
      return <div>logging in</div>;
    }

    return (
      <IntlProvider locale={locale} messages={message}>
        <Router history={history}>
          <SplatnetProvider locale={locale}>
            <Routes
              loggedIn={loggedIn}
              setLogin={this.setLogin}
              token={sessionToken}
              logoutCallback={this.getSessionToken}
              setLocale={this.setLocale}
              locale={locale}
            />
          </SplatnetProvider>
        </Router>
      </IntlProvider>
    );
  }
}

export default App;
