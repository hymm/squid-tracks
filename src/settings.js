import React from 'react';
import { Link } from 'react-router-dom';
import {
  Grid,
  Col,
  Row,
  Well,
  Button,
  FormGroup,
  ControlLabel,
  FormControl,
  HelpBlock,
  Checkbox
} from 'react-bootstrap';
import { event } from './analytics';
const { remote, ipcRenderer } = window.require('electron');
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

const SettingsScreen = ({ token, logoutCallback }) =>
  <Grid fluid style={{ marginTop: 65 }}>
    <Row>
      <Col md={12}>
        <StatInkSettings />
      </Col>
    </Row>
    <Row>
      <Col md={12}>
        <h3>Google Analytics</h3>
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
        <h3>Other Settings</h3>
        <h4>Session Token</h4>
        <Well bsSize="large" style={{ wordWrap: 'break-word' }}>
          {token}
        </Well>
        <Button
          block
          bsStyle="danger"
          onClick={() => handleLogoutClick(logoutCallback)}
        >
          Logout
        </Button>
      </Col>
    </Row>
  </Grid>;

export default SettingsScreen;
