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
  ButtonToolbar
} from 'react-bootstrap';
import { Route, Redirect, Switch } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { ipcRenderer } from 'electron';

class LoginCookie extends React.Component {
  state = {
    token: '',
    mitm: false,
    ips: []
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

  handleMitmClick = () => {
    let ips = [];
    if (this.state.mitm) {
      ipcRenderer.sendSync('stopMitm');
    } else {
      ipcRenderer.sendSync('startMitm');
      ips = ipcRenderer.sendSync('getIps');
    }
    this.setState({ mitm: !this.state.mitm, ips });
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
    const { mitm, ips, token } = this.state;
    return (
      <Grid fluid>
        <Row>
          <Col md={3} />
          <Col md={6}>
            <LinkContainer exact to="/login">
              <Button>Back</Button>
            </LinkContainer>
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
                <Button onClick={this.handleMitmClick}>
                  {mitm ? 'Stop Proxy' : 'Start Proxy'}
                </Button>
                <Button
                  type="submit"
                  bsStyle="primary"
                  disabled={token.length <= 0}
                >
                  Login
                </Button>
              </ButtonToolbar>
            </form>
            <ul>
              <li>{ips[0]}</li>
            </ul>
          </Col>
          <Col md={3} />
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
              <Button block>Login</Button>
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
