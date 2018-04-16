import React from 'react';
import { Grid, Row, Col, ButtonToolbar, Button } from 'react-bootstrap';
import { Subscriber } from 'react-broadcast';
import StageCard from './components/stage-card';
import PlayerCard from './components/player-card';
import WeaponCard from './components/weapon-card';
import { event } from './analytics';
import { defineMessages, injectIntl } from 'react-intl';

class RecordsContainer extends React.Component {
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
    refreshing: false
  };

  componentDidMount() {
    this.props.splatnet.comm.updateRecords();
  }

  render() {
    const { intl, splatnet } = this.props;
    const { records } = splatnet.current;
    const { refreshing } = this.state;

    return (
      <div>
        <ButtonToolbar style={{ marginBottom: '10px' }}>
          <Button
            onClick={() => {
              event('records', 'refresh');
              splatnet.comm.updateRecords();
              this.setState({ refreshing: true });
              setTimeout(() => this.setState({ refreshing: false }), 2000);
            }}
            disabled={refreshing}
          >
            {this.state.refreshing
              ? intl.formatMessage(this.messages.refreshed)
              : intl.formatMessage(this.messages.refresh)}
          </Button>
        </ButtonToolbar>
        <PlayerCard records={records.records} />
        <StageCard records={records.records} />
        <WeaponCard records={records.records} />
      </div>
    );
  }
}

const RecordsContainerIntl = injectIntl(RecordsContainer);

const Records = ({ splatnet }) => (
  <Grid fluid style={{ marginTop: 65 }}>
    <Row>
      <Col md={12}>
        <RecordsContainerIntl splatnet={splatnet} />
      </Col>
    </Row>
  </Grid>
);

const SubscribedRecords = () => {
  return (
    <Subscriber channel="splatnet">
      {splatnet => <Records splatnet={splatnet} />}
    </Subscriber>
  );
};

export default SubscribedRecords;
