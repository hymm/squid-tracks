import React from 'react';
import {
  Grid,
  Row,
  Col,
  Jumbotron,
  Button,
  FormControl,
  FormGroup,
  ControlLabel,
  ButtonToolbar,
  SplitButton,
  MenuItem
} from 'react-bootstrap';
import { Route, Redirect, Switch } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { ipcRenderer, remote } from 'electron';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';
const { openExternal } = remote.shell;

class ProxyButton extends React.Component {
  state = {
    mitm: false,
    address: { ips: [], port: 0 }
  };

  messages = defineMessages({
      proxyStart: {
          id: 'loginCookie.proxyStart',
          defaultMessage: 'Start Proxy',
      },
      proxyRunning: {
          id: 'loginCookie.proxyRunning',
          defaultMessage: 'Proxy running on {ip}, Port {port}'
      }
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
    const { mitm, address, } = this.state;
    const { intl } = this.props;
    const buttonText = mitm
        ? intl.formatMessage(this.messages.proxyRunning, {ip: address.ips[0], port: address.port})
        : intl.formatMessage(this.messages.proxyStart);
    if (address.ips.length > 1) {
      return (
        <SplitButton
          title={buttonText}
          onClick={this.handleMitmClick}
          bsStyle={mitm ? 'warning' : 'default'}
        >
          <MenuItem header><FormattedMessage
              id='loginCookie.additionalIps'
              defaultMessage='Additional IP Addresses'
          /></MenuItem>
          {address.ips.map(address => (
            <MenuItem key={address}>{address}</MenuItem>
          ))}
        </SplitButton>
      );
    }
    return (
      <Button
        onClick={this.handleMitmClick}
        bsStyle={mitm ? 'warning' : 'default'}
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
        id: 'loginCookie.instructionsUrl',
        defaultMessage: 'https://github.com/hymm/squid-tracks/wiki/en_getCookie',
    }
  })
  state = {
    token: ''
  };

  componentDidMount() {
    ipcRenderer.once('interceptedIksm', this.handleIntercept);
    this.setState({
      token: ipcRenderer.sendSync('getFromStore', 'iksmCookie')
    });
  }

  componentWillUnmount() {
    ipcRenderer.removeListener('interceptedIksm', this.handleIntercept);
  }

  handleIntercept = (e, value) => {
    this.setState({ token: value });
    this.login(value);
  };

  handleChange = e => {
    this.setState({ token: e.target.value });
  };

  handleSubmit = e => {
    this.login(this.state.token);
  };

  login(iksmValue) {
    ipcRenderer.sendSync('setIksmToken', iksmValue);
    ipcRenderer.sendSync('setToStore', 'iksmCookie', iksmValue);
    this.props.setLogin(true);
  }

  render() {
    const { token } = this.state;
    const { intl } = this.props;
    return (
      <Grid fluid>
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
                    id='loginCookie.warning'
                    defaultMessage={`WARNING: This process is less secure than the previous log in method.
                        If you don't understand the risks, please wait until the
                        previous login system is reimplemented. This login system is for those desperate to
                        use SquidTracks.`}
                />
                <h3><a
                  onClick={() =>
                    openExternal(intl.formatMessage(this.messages.instructionsUrl))
                  }
                  style={{ cursor: 'pointer' }}
                >
                  <FormattedMessage
                      id='loginCookie.instructions'
                      defaultMessage='View Instructions'
                  />
                </a></h3>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <form onSubmit={this.handleSubmit}>
                  <FormGroup>
                    <ControlLabel>iksm session Token</ControlLabel>
                    <FormControl
                      type="text"
                      value={this.state.token}
                      onChange={this.handleChange}
                    />
                  </FormGroup>
                  <ButtonToolbar>
                    <ProxyButtonWithIntl />
                    <Button
                      type="submit"
                      bsStyle="primary"
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
      </Grid>
    );
  }
}

const LoginCookieWithIntl = injectIntl(LoginCookie);

const LoginSplash = () => {
  return (
    <Grid fluid>
      <Row>
        <Col md={12} style={{ textAlign: 'center' }}>
          <Jumbotron style={{ background: 'pink' }}>
            <h1>SquidTracks</h1>
            <h2><FormattedMessage
                id='login.tagLine'
                defaultMessage='An Unofficial Splatnet Client for your Desktop'
            /></h2>
            <h3><FormattedMessage
                id='login.loginInformation'
                defaultMessage={`Normal login is currently broken. You can try to login with a
                    cookie if you know how to get it. Follow progress on Twitter {twitterLink}`}
                values={{twitterLink:
                    <a
                      onClick={() => openExternal('https://twitter.com/SquidTracks')}
                      style={{ cursor: 'pointer' }}
                    >
                      @SquidTracks
                    </a>
                }}
            />
            </h3>
            <a href={ipcRenderer.sendSync('getLoginUrl')}>
              <Button block disabled style={{ display: 'none' }}>
                  <FormattedMessage
                      id='login.login'
                      defaultMessage='Login'
                  />
              </Button>
            </a>
            <LinkContainer to="/login/cookie">
              <Button block>
                  <FormattedMessage
                      id='login.loginWithCookie'
                      defaultMessage='Login with Session Cookie'
                  />
              </Button>
            </LinkContainer>
          </Jumbotron>
        </Col>
      </Row>
    </Grid>
  );
};

const LoginRoutes = ({ setLogin }) => {
  return (
    <Switch>
      <Route path="/login" exact component={LoginSplash} />
      <Route
        path="/login/cookie"
        component={() => <LoginCookieWithIntl setLogin={setLogin} />}
      />
      <Redirect exact from="/" to="/login" />
    </Switch>
  );
};

const Login = ({ setLogin }) => {
  return <LoginRoutes setLogin={setLogin} />;
};

export default Login;
