import React from 'react';
import {
  Grid,
  Row,
  Col,
  Jumbotron,
  Button,
  FormControl,
  FormGroup,
  ControlLabel
} from 'react-bootstrap';
import { Route, Redirect, Switch } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { ipcRenderer } from 'electron';

class LoginCookie extends React.Component {
  state = {
    token: '',
    mitm: false
  };

  componentDidMount() {
    ipcRenderer.on('interceptedIksm', this.handleIntercept);
    this.setState({
      token: ipcRenderer.sendSync('getFromStore', 'iksmCookie')
    });
  }

  componentWillUnmount() {
    ipcRenderer.removeListener('interceptedIksm', this.handleIntercept);
  }

  handleIntercept = (e, value) => {
    this.setState({ token: value });
  };

  handleChange = e => {
    this.setState({ token: e.target.value });
  };

  handleMitmClick = () => {
    if (this.state.mitm) {
      ipcRenderer.sendSync('stopMitm');
    } else {
      ipcRenderer.sendSync('startMitm');
    }
    this.setState({ mitm: !this.state.mitm });
  };

  handleSubmit = e => {
    ipcRenderer.sendSync('setIksmToken', this.state.token);
    ipcRenderer.sendSync('setToStore', 'iksmCookie', this.state.token);
    this.props.setLogin(true);
  };

  render() {
    const { mitm } = this.state;
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
              <Button type="submit" bsStyle="primary">
                Login
              </Button>
            </form>

            <Button onClick={this.handleMitmClick}>
              {mitm ? 'Stop Proxy' : 'Start Proxy'}
            </Button>
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
