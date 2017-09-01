import React from 'react';
import { Grid, Row, Col, ButtonToolbar, Button } from 'react-bootstrap';
import StageCard from './components/stage-card';
import PlayerCard from './components/player-card';
import WeaponCard from './components/weapon-card';
import { event } from './analytics';
import { ipcRenderer } from 'electron';
import { defineMessages, injectIntl } from 'react-intl';

class ResultsContainer extends React.Component {
  messages = defineMessages({
    refresh: {
      id: 'records.refreshButton.refresh',
      defaultMessage: 'Refresh'
    },
    refreshed: {
      id: 'records.refreshButton.refreshed',
      defaultMessage: 'Refreshed'
    }
  });

  state = {
    records: {
      records: {}
    },
    refreshing: false
  };

  componentDidMount() {
    this.getRecords();
  }

  getRecords() {
    const records = ipcRenderer.sendSync('getApi', 'records');
    this.setState({ records: records });
  }

  render() {
    const { intl } = this.props;
    return (
      <div>
        <ButtonToolbar style={{ marginBottom: '10px' }}>
          <Button
            onClick={() => {
              event('records', 'refresh');
              this.getRecords();
              this.setState({ refreshing: true });
              setTimeout(() => this.setState({ refreshing: false }), 2000);
            }}
            disabled={this.state.refreshing}
          >
            {this.state.refreshing
              ? intl.formatMessage(this.messages.refreshed)
              : intl.formatMessage(this.messages.refresh)}
          </Button>
        </ButtonToolbar>
        <PlayerCard records={this.state.records.records} />
        <StageCard records={this.state.records.records} />
        <WeaponCard records={this.state.records.records} />
      </div>
    );
  }
}

const ResultsContainerIntl = injectIntl(ResultsContainer);

const Records = () =>
  <Grid fluid style={{ marginTop: 65 }}>
    <Row>
      <Col md={12}>
        <ResultsContainerIntl />
      </Col>
    </Row>
  </Grid>;

export default Records;
