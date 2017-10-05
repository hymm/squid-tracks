import React from 'react';
import { Grid, Row, Col, Button, Alert, Panel } from 'react-bootstrap';
import { Subscriber } from 'react-broadcast';
import { ipcRenderer } from 'electron';
import { event } from './analytics';

class ErrorPage extends React.Component {
    state = {
        open: false
    }

    handleClick = () => {
        this.setState({ open: !this.state.open });
    }

    handleLogout = () => {
        event('user', 'logout');
        ipcRenderer.sendSync('logout');
        this.props.logoutCallback();
    }

    render() {
        const { splatnet } = this.props;
        return (
            <Alert bsStyle="danger">
                <h4>Error calling Splatnet API</h4>
                <p>
                  Your session has probably expired.
                  Please logout and use the proxy to get another session.
                  <Button onClick={this.handleClick}>More</Button>
                </p>
                <p>
                    <Panel collapsible expanded={this.state.open}>
                        {splatnet.lastError ? splatnet.lastError : 'Error'}
                    </Panel>
                </p>
                <Button block bsStyle="primary" onClick={this.handleLogout}>Logout</Button>
            </Alert>
        );
    }
}

const ErrorPageWithSplatnet = (props) => {
    return (
        <Subscriber channel="splatnet">
            {splatnet =>
                <Grid fluid style={{ marginTop: 65 }}>
                    <Row>
                        <Col md={12}>
                            <ErrorPage {...props} splatnet={splatnet} />
                        </Col>
                    </Row>
                </Grid>
            }
        </Subscriber>
    );
};

export default ErrorPageWithSplatnet;
