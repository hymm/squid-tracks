import React from 'react';
import { Link } from 'react-router-dom';
import {
  Grid,
  Col,
  Row,
  Button,
  FormGroup,
  ControlLabel,
  FormControl,
  HelpBlock,
  Checkbox
} from 'react-bootstrap';
import jws from 'jws';
import { event } from './analytics';
const { remote, ipcRenderer, clipboard } = require('electron');
const { openExternal } = remote.shell;

class StatInkSettings extends React.Component {
  state = {
    apiToken: '',
    statInkSaveButtonText: 'Save Token'
  };

  componentDidMount() {
    this.getStatInkApiToken();
  }

  getStatInkApiToken = () => {
    this.setState({ apiToken: ipcRenderer.sendSync('getStatInkApiToken') });
  };

  handleChange = e => {
    this.setState({ apiToken: e.target.value });
  };

  handleSubmit = e => {
    event('stat.ink', 'saved-token');
    ipcRenderer.sendSync('setStatInkApiToken', this.state.apiToken);
    this.setState({ statInkSaveButtonText: 'Token Saved' });
    setTimeout(() => {
      this.setState({ statInkSaveButtonText: 'Save Token' });
    }, 1000);
    e.preventDefault();
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <h3>Stat.ink Settings</h3>
        <FormGroup>
          <ControlLabel>API Token</ControlLabel>
          <HelpBlock>
            Copy from{' '}
            <a
              onClick={() => openExternal('https://stat.ink/profile')}
              style={{ cursor: 'pointer' }}
            >
              https://stat.ink/profile
            </a>, paste below, and click Save
          </HelpBlock>
          <FormControl
            type="text"
            value={this.state.apiToken}
            onChange={this.handleChange}
          />
        </FormGroup>
        <Button
          type="submit"
          disabled={this.state.statInkSaveButtonText === 'Token Saved'}
        >
          {this.state.statInkSaveButtonText}
        </Button>
      </form>
    );
  }
}

function handleLogoutClick(callback) {
  event('user', 'logout');
  ipcRenderer.sendSync('logout');
  callback();
}

class GoogleAnalyticsCheckbox extends React.Component {
  state = { enabled: false };

  componentDidMount() {
    this.setState({
      enabled: ipcRenderer.sendSync('getFromStore', 'gaEnabled')
    });
  }

  handleClick = () => {
    event('ga', !this.state.enabled ? 'enabled' : 'disabled');
    ipcRenderer.sendSync('setToStore', 'gaEnabled', !this.state.enabled);
    this.setState({ enabled: !this.state.enabled });
  };

  render() {
    return (
      <Checkbox checked={this.state.enabled} onClick={this.handleClick}>
        Enabled
      </Checkbox>
    );
  }
}

class IksmToken extends React.Component {
  state = {
    cookie: { key: '', value: '', expires: '' }
  };

  componentDidMount() {
    ipcRenderer.send('getIksmToken');
    ipcRenderer.on('iksmToken', this.handleToken);
  }

  handleToken = (e, cookie) => {
    this.setState({ cookie: cookie });
  };

  render() {
    const { cookie } = this.state;
    return (
      <div>
        <h4>iksm Token</h4>
        Expiration: {cookie.expires}
        <br />
        <Button onClick={() => clipboard.writeText(cookie.value)}>
          Copy to Clipboard
        </Button>
      </div>
    );
  }
}

class LanguageSettings extends React.Component {
  languages = [
    { name: 'Default', code: '' },
    { name: 'Deutsch', code: 'de' },
    { name: 'English', code: 'en' },
    { name: 'Español', code: 'es' },
    { name: 'Francais', code: 'fr' },
    { name: 'Italiano', code: 'it' },
    { name: '日本語', code: 'ja' }
  ];

  handleChange = e => {
      this.props.setLocale(e.target.value);
  };

  render() {
    const { locale } = this.props;
    return (
      <Row>
        <Col md={12}>
          <h3>Splatnet API Language</h3>
          Languages are limited by Nintendo regions, so several of the languages
          listed will not work. If you think your language should be supported,
          please contact the developer.
          <FormControl
            value={locale}
            id="languageSelect"
            componentClass="select"
            onChange={this.handleChange}
          >
            {this.languages.map(language =>
              <option key={language.code} value={language.code}>
                {language.name}
              </option>
            )}
          </FormControl>
        </Col>
      </Row>
    );
  }
}

const SettingsScreen = ({ token, logoutCallback, setLocale, locale }) => {
  const expUnix = JSON.parse(jws.decode(token).payload).exp;
  const tokenExpiration = token
    ? new Date(expUnix * 1000).toString()
    : 'unknown';
  return (
    <Grid fluid style={{ marginTop: 65, marginBotton: 30 }}>
      <LanguageSettings setLocale={setLocale} locale={locale} />
      <Row>
        <Col md={12}>
          <StatInkSettings />
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <h3>Google Analytics</h3>
          This program uses google analytics to track version uptake, activity,
          bugs, and crashing. If you find this creepy you can disable this
          feature below.
          <GoogleAnalyticsCheckbox />
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <h3>Debugging</h3>
          <Link to="/testApi">
            <Button>API Checker</Button>
          </Link>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <h3>Nintendo User Info</h3>
          <strong>DO NOT SHARE Session Token or iksm Token.</strong> These are
          available here for debugging purposes. Sharing these could lead to
          someone stealing your personal information.
          <h4>Session Token</h4>
          Expiration: {tokenExpiration}
          <br />
          <Button onClick={() => clipboard.writeText(token)}>
            Copy to Clipboard
          </Button>
          <IksmToken />
          <Button
            block
            bsStyle="danger"
            style={{ marginTop: 10 }}
            onClick={() => handleLogoutClick(logoutCallback)}
          >
            Logout
          </Button>
        </Col>
      </Row>
    </Grid>
  );
};

export default SettingsScreen;
