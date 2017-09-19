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
const { openExternal } = remote.shell;

class ProxyButton extends React.Component {
  state = {
    mitm: false,
    address: { ips: [], port: 0 }
  };

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

  render() {
    const { mitm, address } = this.state;
    if (address.ips.length > 1) {
      return (
        <SplitButton
          title={
            mitm ? (
              `Proxy running on ${address.ips[0]}, Port ${address.port}`
            ) : (
              'Start Proxy'
            )
          }
          onClick={this.handleMitmClick}
          bsStyle={mitm ? 'warning' : 'default'}
        >
          <MenuItem header>Additional IP Addresses</MenuItem>
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
        {mitm ? (
          `Proxy running on ${address.ips[0]}, Port ${address.port}`
        ) : (
          'Start Proxy'
        )}
      </Button>
    );
  }
}

class LoginCookie extends React.Component {
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
    if (this.state.mitm) {
      ipcRenderer.sendSync('stopMitm');
    }
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
    return (
      <Grid fluid>
        <Row>
          <Col md={6}>
            <Row>
              <Col md={12}>
                <LinkContainer exact to="/login">
                  <Button>Back</Button>
                </LinkContainer>
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
                    <ProxyButton />
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
            <Row>
              <Col md={12}>
                <ul>
                  <li>
                    <a
                      onClick={() =>
                        openExternal(
                          'https://github.com/hymm/squid-tracks/wiki/en_getCookie'
                        )}
                      style={{ cursor: 'pointer' }}
                    >
                      English Instructions
                    </a>
                  </li>
                  <li>
                    <a
                      onClick={() =>
                        openExternal(
                          'https://github.com/hymm/squid-tracks/wiki/jp_getCookie'
                        )}
                      style={{ cursor: 'pointer' }}
                    >
                      Japanese Instructions
                    </a>
                  </li>
                </ul>
              </Col>
            </Row>
          </Col>
        </Row>
      </Grid>
    );
  }
}

const LoginSplash = () => {
  return (
    <Grid fluid>
      <Row>
        <Col md={12} style={{ textAlign: 'center' }}>
          <Jumbotron style={{ background: 'pink' }}>
            <h1>SquidTracks</h1>
            <h2>Splatnet for your Desktop</h2>
            <h3>
              Normal login is currently broken. You can try to login with a
              cookie if you know how to get it. Follow progress on Twitter
              @SquidTracks
            </h3>
            <a href={ipcRenderer.sendSync('getLoginUrl')}>
              <Button block disabled>
                Login
              </Button>
            </a>
            <LinkContainer to="/login/cookie">
              <Button block>Login with Cookie</Button>
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
        component={() => <LoginCookie setLogin={setLogin} />}
      />
      <Redirect exact from="/" to="/login" />
    </Switch>
  );
};

const Login = ({ setLogin }) => {
  return <LoginRoutes setLogin={setLogin} />;
};

export default Login;
