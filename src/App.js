import React, { Component } from 'react';
import { Router } from 'react-router-dom';
import createHashHistory from 'history/createHashHistory';
import { IntlProvider } from 'react-intl';
import Routes from './routes';
import messages from './messages';
import { screenview } from './analytics';
import Login from './login';
import log from 'electron-log';
import { ipcRenderer } from 'electron';

import './App.css';
import 'bootstrap/dist/css/bootstrap.css';

window.addEventListener('error', event => {
  log.error(`UnhandledError in renderer: ${event.error}`);
});

window.addEventListener('unhandledrejection', event => {
  log.error(`Unhandled Promise Rejection in renderer: ${event.reason}`);
});

const history = createHashHistory();
history.listen(location => {
  screenview(`${location.pathname}${location.search}${location.hash}`);
});

class App extends Component {
  state = {
    sessionToken: '',
    locale: 'en'
  };

  componentDidMount() {
    this.getSessionToken();
    screenview('Start');
    this.setState({ locale: ipcRenderer.sendSync('getFromStore', 'locale') });
  }

  getSessionToken = () => {
    this.setState({ sessionToken: ipcRenderer.sendSync('getSessionToken') });
  };

  setLocale = locale => {
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
                locale={locale}
              />
            : <Login />}
        </Router>
      </IntlProvider>
    );
  }
}

export default App;
