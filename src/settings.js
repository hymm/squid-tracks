import React from 'react';
import { Grid, Col, Row, Well } from 'react-bootstrap';

const SettingsScreen = ({ token }) =>
  <Grid fluid>
    <Row>
      <Col md={12}>
        <h3>Settings</h3>
        <h4>Session Token</h4>
        <Well bsSize="large" style={{ wordWrap: 'break-word' }}>
          {token}
        </Well>
      </Col>
    </Row>
  </Grid>;

export default SettingsScreen;
