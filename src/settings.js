import React from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Col,
  Row,
  Button,
  FormGroup,
  FormControl,
  Form,
  Card,
} from 'react-bootstrap';
import { FaCopy } from 'react-icons/fa';
import jws from 'jws';
import { event } from './analytics';
import LanguageSelect from './components/language-select';
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
const { remote, ipcRenderer, clipboard } = require('electron');
const { openExternal } = remote.shell;

class StatInkSettings extends React.Component {
  state = {
    apiToken: '',
    saved: false,
  };

  messages = defineMessages({
    saveToken: {
      id: 'Settings.StatInk.ButtonText.saveToken',
      defaultMessage: 'Save Token',
    },
    tokenSaved: {
      id: 'Settings.StatInk.ButtonText.tokenSaved',
      defaultMessage: 'Token Saved',
    },
  });

  componentDidMount() {
    this.getStatInkApiToken();
  }

  getStatInkApiToken = () => {
    this.setState({ apiToken: ipcRenderer.sendSync('getStatInkApiToken') });
  };

  handleChange = (e) => {
    this.setState({ apiToken: e.target.value });
  };

  handleSubmit = (e) => {
    event('stat.ink', 'saved-token');
    ipcRenderer.sendSync('setStatInkApiToken', this.state.apiToken);
    this.setState({ saved: true });
    setTimeout(() => {
      this.setState({ saved: false });
    }, 1000);
    e.preventDefault();
  };

  render() {
    const { saved } = this.state;
    const { intl } = this.props;
    return (
      <Card>
        <Card.Header>
          <FormattedMessage
            id="Settings.StatInk.title"
            defaultMessage="stat.ink API Token"
          />
        </Card.Header>
        <Card.Body>
          <form onSubmit={this.handleSubmit}>
            <FormGroup>
              <Form.Text>
                <FormattedMessage
                  id="Settings.StatInk.HelpMessage"
                  defaultMessage="Copy API Token from {link}, paste below, and click Save"
                  values={{
                    link: (
                      <button
                        className="button-as-link"
                        onClick={() => openExternal('https://stat.ink/profile')}
                        style={{ cursor: 'pointer' }}
                      >
                        https://stat.ink/profile
                      </button>
                    ),
                  }}
                />
              </Form.Text>
              <FormControl
                type="text"
                value={this.state.apiToken}
                onChange={this.handleChange}
              />
            </FormGroup>
            <Button type="submit" disabled={saved}>
              {intl.formatMessage(
                saved ? this.messages.tokenSaved : this.messages.saveToken
              )}
            </Button>
          </form>
        </Card.Body>
      </Card>
    );
  }
}

class GoogleAnalyticsCheckbox extends React.Component {
  state = { enabled: false };

  componentDidMount() {
    this.setState({
      enabled: ipcRenderer.sendSync('getFromStore', 'gaEnabled'),
    });
  }

  handleClick = () => {
    event('ga', !this.state.enabled ? 'enabled' : 'disabled');
    ipcRenderer.sendSync('setToStore', 'gaEnabled', !this.state.enabled);
    this.setState({ enabled: !this.state.enabled });
  };

  render() {
    return (
      <Form.Check
        type="checkbox"
        checked={this.state.enabled}
        onChange={this.handleClick}
        label={
          <FormattedMessage
            id="Settings.GoogleAnalytics.EnabledCheckboxLabel"
            defaultMessage="Enabled"
          />
        }
      />
    );
  }
}

class IksmToken extends React.Component {
  state = {
    cookie: '',
  };

  componentDidMount() {
    ipcRenderer.send('getIksmToken');
    ipcRenderer.on('iksmToken', this.handleToken);
  }

  componentWillUnmount() {
    ipcRenderer.removeListener('iksmToken', this.handleToken);
  }

  handleToken = (e, cookie) => {
    this.setState({ cookie: cookie });
  };

  render() {
    const { cookie } = this.state;
    return (
      <div>
        <h4>
          <FormattedMessage
            id="Settings.Tokens.iksmToken.title"
            defaultMessage="iksm Token"
          />{' '}
          {cookie.length > 0 ? (
            <FaCopy
              style={{ fontSize: 20, cursor: 'pointer' }}
              onClick={() => {
                clipboard.writeText(cookie);
                event('settings', 'copy-iksm-token');
              }}
            />
          ) : null}
        </h4>
      </div>
    );
  }
}

const LanguageSettings = ({ setLocale, locale }) => {
  return (
    <Row>
      <Col md={12}>
        <Card>
          <Card.Header>
            <FormattedMessage
              id="Settings.Language.title"
              defaultMessage="Language"
            />
          </Card.Header>
          <Card.Body>
            <FormattedMessage
              id="Settings.Language.warning"
              defaultMessage="Languages in the Splatnet API are limited by Nintendo regions, so some languages may not work correctly."
            />
            <LanguageSelect setLocale={setLocale} locale={locale} />
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

class SessionToken extends React.Component {
  state = { token: '' };

  componentDidMount() {
    this.setState({
      token: ipcRenderer.sendSync('getFromStore', 'sessionToken'),
    });
  }

  render() {
    const { token } = this.state;
    const expUnix = token ? JSON.parse(jws.decode(token).payload).exp : 0;
    const tokenExpiration = token
      ? new Date(expUnix * 1000).toString()
      : 'unknown';

    return (
      <React.Fragment>
        <h4>
          <FormattedMessage
            id="Settings.tokens.sessionToken"
            defaultMessage="Session Token"
            description="long term session token that can be used to obtain a new cookie"
          />{' '}
          {token.length > 0 ? (
            <FaCopy
              onClick={() => {
                clipboard.writeText(token);
                event('settings', 'copy-session-token');
              }}
              style={{ fontSize: 20, cursor: 'pointer' }}
            />
          ) : null}
        </h4>
        <FormattedMessage
          id="Settings.Tokens.sessionTokenExpiration"
          defaultMessage="Expiration: {tokenExpiration}"
          values={{ tokenExpiration }}
        />
      </React.Fragment>
    );
  }
}

const GoogleAnalyticsSettings = () => {
  return (
    <Card>
      <Card.Header>
        <FormattedMessage
          id="Settings.GoogleAnalytics.title"
          defaultMessage="Google Analytics"
        />
      </Card.Header>
      <Card.Body>
        <FormattedMessage
          id="Settings.GoogleAnalytics.description"
          defaultMessage={`
            This program uses google analytics to track version uptake,
            user activity, bugs, and crashing. If you find this creepy you can
            disable this feature below.
          `}
        />
        <GoogleAnalyticsCheckbox />
      </Card.Body>
    </Card>
  );
};

const Debugging = () => {
  return (
    <Card>
      <Card.Header>
        <FormattedMessage
          id="Settings.Debugging.title"
          defaultMessage="Debugging"
        />
      </Card.Header>
      <Card.Body>
        <Link to="/testApi">
          <Button>
            <FormattedMessage
              id="Settings.Debugging.buttonText.openApiChecker"
              defaultMessage="API Checker"
            />
          </Button>
        </Link>
      </Card.Body>
    </Card>
  );
};

const SecurityTokens = () => {
  return (
    <Card>
      <Card.Header>
        <FormattedMessage
          id="Settings.Tokens.title"
          defaultMessage="Splatnet 2 Access Tokens"
        />
      </Card.Header>
      <Card.Body>
        <FormattedMessage
          id="Settings.Tokens.warning"
          defaultMessage={`
            <b>DO NOT SHARE Session Token or iksm Token.</b> These
            are available here for debugging purposes. Sharing these could
            lead to someone stealing your personal information.
          `}
          values={{
            b: (chunks) => <strong>{chunks}</strong>,
          }}
        />

        <SessionToken />
        <IksmToken />
      </Card.Body>
    </Card>
  );
};

const SettingsScreen = ({ token, logoutCallback, setLocale, locale, intl }) => {
  return (
    <Container fluid style={{ marginTop: '1rem', marginBotton: 30 }}>
      <LanguageSettings setLocale={setLocale} locale={locale} />
      <Row>
        <Col md={12}>
          <StatInkSettings intl={intl} />
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <GoogleAnalyticsSettings />
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <Debugging />
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <SecurityTokens />
        </Col>
      </Row>
    </Container>
  );
};

export default injectIntl(SettingsScreen);
