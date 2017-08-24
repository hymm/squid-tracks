import React from 'react';
import { Grid, Row, Col, Jumbotron, Button } from 'react-bootstrap';
const { ipcRenderer } = require('electron');

const Login = ({ token }) =>
  <Grid fluid>
    <Row>
      <Col md={12} style={{ textAlign: 'center' }}>
        <Jumbotron>
          <h1>SquidTracks</h1>
          <h2>Splatnet for your Desktop</h2>
          <a href={ipcRenderer.sendSync('getLoginUrl')}>
            <Button block>Login</Button>
          </a>
        </Jumbotron>
      </Col>
    </Row>
  </Grid>;

export default Login;
