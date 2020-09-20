import React from 'react';
import {
  Container,
  Row,
  Col,
  Jumbotron,
  Button,
  Form,
  ButtonToolbar,
  SplitButton,
  Dropdown,
} from 'react-bootstrap';
import { Route, Redirect, Switch, withRouter } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { ipcRenderer, remote } from 'electron';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';
import LanguageSelect from './components/language-select';
const { openExternal } = remote.shell;
const { app } = remote;

const appVersion = app.getVersion();

class ProxyButton extends React.Component {
  state = {
    mitm: false,
    address: { ips: [], port: 0 },
  };

  messages = defineMessages({
    proxyStart: {
      id: 'login.cookie.proxyStart',
      defaultMessage: 'Start Proxy',
    },
    proxyRunning: {
      id: 'login.cookie.proxyRunning',
      defaultMessage: 'Proxy running on {ip}, Port {port}',
    },
  });

  handleMitmClick = () => {
    let address = { ip: '', port: 0 };
    if (this.state.mitm) {
      ipcRenderer.sendSync('stopMitm');
    } else {
      ipcRenderer.sendSync('startMitm');
      address = ipcRenderer.sendSync('getIps');
    }
    this.setState({ mitm: !this.state.mitm, address });
  };

  componentWillUnmount() {
    if (this.state.mitm) {
      ipcRenderer.sendSync('stopMitm');
    }
  }

  render() {
    const { mitm, address } = this.state;
    const { intl } = this.props;
    const buttonText = mitm
      ? intl.formatMessage(this.messages.proxyRunning, {
          ip: address.ips[0],
          port: address.port,
        })
      : intl.formatMessage(this.messages.proxyStart);
    if (address.ips.length > 1) {
      return (
        <SplitButton
          title={buttonText}
          onClick={this.handleMitmClick}
          variant={mitm ? 'warning' : 'default'}
        >
          <Dropdown.Item header>
            <FormattedMessage
              id="login.cookie.additionalIps"
              defaultMessage="Additional IP Addresses"
            />
          </Dropdown.Item>
          {address.ips.map((address) => (
            <Dropdown.Item key={address}>{address}</Dropdown.Item>
          ))}
        </SplitButton>
      );
    }
    return (
      <Button
        onClick={this.handleMitmClick}
        variant={mitm ? 'warning' : 'default'}
      >
        {buttonText}
      </Button>
    );
  }
}

const ProxyButtonWithIntl = injectIntl(ProxyButton);

class LoginCookie extends React.Component {
  messages = defineMessages({
    instructionsUrl: {
      id: 'login.cookie.instructionsUrl',
      defaultMessage: 'https://github.com/hymm/squid-tracks/wiki/en_getCookie',
    },
  });
  state = {
    token: '',
  };

  componentDidMount() {
    ipcRenderer.once('interceptedIksm', this.handleIntercept);
    this.setState({
      token: ipcRenderer.sendSync('getFromStore', 'iksmCookie'),
    });
  }

  componentWillUnmount() {
    ipcRenderer.removeListener('interceptedIksm', this.handleIntercept);
  }

  handleIntercept = (e, value) => {
    this.setState({ token: value });
    this.login(value);
  };

  handleChange = (e) => {
    this.setState({ token: e.target.value });
  };

  handleSubmit = (e) => {
    this.login(this.state.token);
  };

  login(iksmValue) {
    ipcRenderer.sendSync('setIksmToken', iksmValue);
    ipcRenderer.sendSync('setToStore', 'iksmCookie', iksmValue);
    this.props.setLogin(true);
    this.props.history.push('/');
  }

  render() {
    const { token } = this.state;
    const { intl } = this.props;
    return (
      <Container fluid>
        <Row>
          <Col md={6}>
            <Row>
              <Col md={12}>
                <LinkContainer exact to="/login">
                  <Button>{'<--'}</Button>
                </LinkContainer>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <br />
                <FormattedMessage
                  id="login.cookie.warning.v1"
                  defaultMessage={`WARNING: This process is less secure than the normal log in method.
                    Please follow the linked instructions carefully and delete the installed certificate
                    after logging in.`}
                />
                <h3>
                  <button
                    className="button-as-link"
                    onClick={() =>
                      openExternal(
                        intl.formatMessage(this.messages.instructionsUrl)
                      )
                    }
                    style={{ cursor: 'pointer' }}
                  >
                    <FormattedMessage
                      id="login.cookie.instructions"
                      defaultMessage="Click here to view instructions"
                    />
                  </button>
                </h3>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <form onSubmit={this.handleSubmit}>
                  <Form.Group>
                    <Form.Label>iksm session Token</Form.Label>
                    <Form.Control
                      type="text"
                      value={this.state.token}
                      onChange={this.handleChange}
                    />
                  </Form.Group>
                  <ButtonToolbar>
                    <ProxyButtonWithIntl />
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={token.length <= 0}
                    >
                      Login
                    </Button>
                  </ButtonToolbar>
                </form>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    );
  }
}

const LoginCookieWithIntl = injectIntl(withRouter(LoginCookie));

/*
// taken out since login is broken 
const messagesSplash = defineMessages({
  fApiInfoUrl: {
    id: 'login.splash.fApiInfo.url',
    defaultMessage:
      'https://github.com/frozenpandaman/splatnet2statink/wiki/api-docs'
  }
});
*/
const LoginSplash = ({ setLocale, locale, intl }) => {
  return (
    <Container fluid>
      <Row>
        <Col md={12}>
          <Jumbotron style={{ marginTop: 20 }}>
            <h1 style={{ textAlign: 'center', width: '100%' }}>SquidTracks</h1>
            <h2 style={{ textAlign: 'center', width: '100%', marginTop: 0 }}>
              <FormattedMessage
                id="login.tagLine"
                defaultMessage="An Unofficial Splatnet Client for your Desktop"
              />
            </h2>
            <h5 style={{ textAlign: 'center', width: '100%' }}>
              {`Version ${appVersion} `}
              <button
                className="button-as-link"
                onClick={() =>
                  openExternal(
                    'https://github.com/hymm/squid-tracks/blob/master/CHANGELOG.md'
                  )
                }
                style={{ cursor: 'pointer' }}
              >
                Change Log
              </button>
            </h5>
            <h4 style={{ textAlign: 'left' }}>
              <FormattedMessage
                id="login.loginInformation.v2"
                defaultMessage={`Follow {twitterLink} for
                  information about updates.`}
                values={{
                  twitterLink: (
                    <button
                      className="button-as-link"
                      onClick={() =>
                        openExternal('https://twitter.com/SquidTracks')
                      }
                      style={{ cursor: 'pointer' }}
                    >
                      @SquidTracks
                    </button>
                  ),
                }}
              />
            </h4>
            <Form.Label>Language</Form.Label>
            <LanguageSelect setLocale={setLocale} locale={locale} />
            <br />
            <a href={ipcRenderer.sendSync('getLoginUrl')}>
              <Button block variant="primary" style={{ marginBottom: 10 }}>
                <FormattedMessage id="login.login" defaultMessage="Login" />
              </Button>
            </a>
            <LinkContainer to="/login/cookie">
              <Button block>
                <FormattedMessage
                  id="login.loginWithCookie"
                  defaultMessage="Login with Session Cookie"
                />
              </Button>
            </LinkContainer>
          </Jumbotron>
        </Col>
      </Row>
    </Container>
  );
};
const LoginSplashWithIntl = injectIntl(LoginSplash);

const LoginRoutes = (props) => {
  return (
    <Switch>
      <Route
        path="/login"
        exact
        component={() => <LoginSplashWithIntl {...props} />}
      />
      <Route
        path="/login/cookie"
        component={() => <LoginCookieWithIntl {...props} />}
      />
      <Redirect to="/login" />
    </Switch>
  );
};

const Login = (props) => {
  return <LoginRoutes {...props} />;
};

export default Login;
