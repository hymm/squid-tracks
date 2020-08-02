import React from 'react';
import {
  Grid,
  Row,
  Col,
  Button,
  Alert,
  Panel,
  ButtonToolbar,
} from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { ipcRenderer } from 'electron';
import { event } from './analytics';
import { useSplatnet } from './splatnet-provider';

class ErrorPage extends React.Component {
  state = {
    open: false,
  };

  handleClick = () => {
    this.setState({ open: !this.state.open });
  };

  handleLogout = () => {
    event('user', 'logout');
    ipcRenderer.sendSync('logout');
    this.props.logoutCallback();
  };

  handleIgnore = () => {
    this.props.history.goBack();
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
            defaultMessage="If you see this multiple times your session has probably expired. Try logging out and logging back in with a new session."
          />
          <Button onClick={this.handleClick}>
            <FormattedMessage id="Error.buttonMoreInfo" defaultMessage="More" />
          </Button>
        </p>
        <p>
          <Panel expanded={this.state.open}>
            <Panel.Collapse>
              <Panel.Body>
                {splatnet.lastError != null ? splatnet.lastError : 'Error'}
              </Panel.Body>
            </Panel.Collapse>
          </Panel>
        </p>
        <ButtonToolbar>
          <Button bsStyle="danger" onClick={this.handleLogout}>
            <FormattedMessage id="Error.buttonLogout" defaultMessage="Logout" />
          </Button>
          <Button bsStyle="default" onClick={this.handleIgnore}>
            <FormattedMessage id="Error.buttonIgnore" defaultMessage="Ignore" />
          </Button>
        </ButtonToolbar>
      </Alert>
    );
  }
}

const ErrorPageWithRouter = withRouter(ErrorPage);

const ErrorPageWithSplatnet = (props) => {
  const splatnet = useSplatnet();
  return (
    <Grid fluid style={{ marginTop: 65 }}>
      <Row>
        <Col md={12}>
          <ErrorPageWithRouter {...props} splatnet={splatnet} />
        </Col>
      </Row>
    </Grid>
  );
};

export default ErrorPageWithSplatnet;
