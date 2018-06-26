import React from 'react';
import { Grid, Row, Col, Button, Alert, Panel } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import { Subscriber } from 'react-broadcast';
import { ipcRenderer } from 'electron';
import { event } from './analytics';

class ErrorPage extends React.Component {
  state = {
    open: false
  };

  handleClick = () => {
    this.setState({ open: !this.state.open });
  };

  handleLogout = () => {
    event('user', 'logout');
    ipcRenderer.sendSync('logout');
    this.props.logoutCallback();
  };

  render() {
    const { splatnet } = this.props;
    return (
      <Alert bsStyle="danger">
        <h4>
          <FormattedMessage
            id="Error.title"
            defaultMessage="Error calling Splatnet 2 API"
          />
        </h4>
        <p>
          <FormattedMessage
            id="Error.helpText"
            defaultMessage="Your session has probably expired. Try logging out and logging back in with a new session."
          />
          <Button onClick={this.handleClick}>
            <FormattedMessage id="Error.buttonMoreInfo" defaultMessage="More" />
          </Button>
        </p>
        <p>
          <Panel collapsible expanded={this.state.open}>
            {splatnet.lastError ? splatnet.lastError : 'Error'}
          </Panel>
        </p>
        <Button block bsStyle="primary" onClick={this.handleLogout}>
          <FormattedMessage id="Error.buttonLogout" defaultMessage="Logout" />
        </Button>
      </Alert>
    );
  }
}

const ErrorPageWithSplatnet = props => {
  return (
    <Subscriber channel="splatnet">
      {splatnet => (
        <Grid fluid style={{ marginTop: 65 }}>
          <Row>
            <Col md={12}>
              <ErrorPage {...props} splatnet={splatnet} />
            </Col>
          </Row>
        </Grid>
      )}
    </Subscriber>
  );
};

export default ErrorPageWithSplatnet;
