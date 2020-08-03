import React from 'react';
import {
  Container,
  Row,
  Col,
  Button,
  Alert,
  Card,
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
      <Alert variant="danger">
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
          <Card expanded={this.state.open}>
            <Card.Collapse>
              <Card.Body>
                {splatnet.lastError != null ? splatnet.lastError : 'Error'}
              </Card.Body>
            </Card.Collapse>
          </Card>
        </p>
        <ButtonToolbar>
          <Button variant="danger" onClick={this.handleLogout}>
            <FormattedMessage id="Error.buttonLogout" defaultMessage="Logout" />
          </Button>
          <Button variant="default" onClick={this.handleIgnore}>
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
    <Container fluid style={{ marginTop: 65 }}>
      <Row>
        <Col md={12}>
          <ErrorPageWithRouter {...props} splatnet={splatnet} />
        </Col>
      </Row>
    </Container>
  );
};

export default ErrorPageWithSplatnet;
