import React from 'react';
import { Grid, Row, Col, Jumbotron, Button } from 'react-bootstrap';

const remote = window.require('electron').remote;
const { getLoginUrl } = remote.require('./main.js');

const Login = ({ token }) =>
  <Grid fluid>
    <Row>
      <Col md={12} style={{ textAlign: 'center' }}>
        <Jumbotron>
          <h1>Splatnet for your Desktop</h1>
          <a href={getLoginUrl()}>
            <Button block>Login</Button>
          </a>
        </Jumbotron>
      </Col>
    </Row>
  </Grid>;

export default Login;
