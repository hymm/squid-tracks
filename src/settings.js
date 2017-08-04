import React from 'react';
import { Grid, Col, Row, Well, Button } from 'react-bootstrap';
const remote = window.require('electron').remote;
const { logout } = remote.require('./main.js');

function handleLogoutClick(callback) {
  logout();
  callback();
}

const SettingsScreen = ({ token, logoutCallback }) =>
  <Grid fluid>
    <Row>
      <Col md={12}>
        <h3>Settings</h3>
        <h4>Session Token</h4>
        <Well bsSize="large" style={{ wordWrap: 'break-word' }}>
          {token}
        </Well>
        <Button onClick={() => handleLogoutClick(logoutCallback)}>
          Logout
        </Button>
      </Col>
    </Row>
  </Grid>;

export default SettingsScreen;
