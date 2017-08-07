import React from 'react';
import {
  Grid,
  Col,
  Row,
  Well,
  Button,
  FormGroup,
  ControlLabel,
  FormControl
} from 'react-bootstrap';
const { ipcRenderer } = window.require('electron');

class StatInkSettings extends React.Component {
  state = {
    apiToken: ''
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
    ipcRenderer.sendSync('setStatInkApiToken', this.state.apiToken);
    e.preventDefault();
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <FormGroup>
          <ControlLabel>stat.ink API Token</ControlLabel>
          <FormControl
            type="text"
            value={this.state.apiToken}
            onChange={this.handleChange}
          />
        </FormGroup>
        <Button type="submit">Save</Button>
      </form>
    );
  }
}

function handleLogoutClick(callback) {
  ipcRenderer.sendSync('logout');
  callback();
}

const SettingsScreen = ({ token, logoutCallback }) =>
  <Grid fluid>
    <Row>
      <Col md={12}>
        <StatInkSettings />
      </Col>
    </Row>
    <Row>
      <Col md={12}>
        <h3>Settings</h3>
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
