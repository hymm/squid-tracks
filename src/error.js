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
import { useHistory } from 'react-router-dom';
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
        </p>
        <p>
          <Card>
            <Card.Body>
              {splatnet.lastError != null ? splatnet.lastError : 'Error'}
            </Card.Body>
          </Card>
        </p>
        <ButtonToolbar>
          <Button className="mr-2" variant="danger" onClick={this.handleLogout}>
            <FormattedMessage id="Error.buttonLogout" defaultMessage="Logout" />
          </Button>
          <Button variant="outline-secondary" onClick={this.handleIgnore}>
            <FormattedMessage id="Error.buttonIgnore" defaultMessage="Ignore" />
          </Button>
        </ButtonToolbar>
      </Alert>
    );
  }
}

function ErrorPageWithSplatnet(props) {
  const splatnet = useSplatnet();
  const history = useHistory();
  return (
    <Container fluid style={{ marginTop: '1rem' }}>
      <Row>
        <Col md={12}>
          <ErrorPage {...props} history={history} splatnet={splatnet} />
        </Col>
      </Row>
    </Container>
  );
}

export default ErrorPageWithSplatnet;
