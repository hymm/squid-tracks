import React from 'react';
import { Container, Row, Col, ButtonToolbar, Button } from 'react-bootstrap';
import StageCard from './components/stage-card';
import PlayerCard from './components/player-card';
import WeaponCard from './components/weapon-card';
import LeagueCard from './components/league-card';
import FesCard from './components/fes-card';
import { event } from './analytics';
import { defineMessages, injectIntl } from 'react-intl';
import { useSplatnet } from './splatnet-provider';

class RecordsContainer extends React.Component {
  messages = defineMessages({
    refresh: {
      id: 'records.refreshButton.refresh',
      defaultMessage: 'Refresh',
    },
    refreshed: {
      id: 'records.refreshButton.refreshed',
      defaultMessage: 'Refreshed',
    },
  });

  state = {
    refreshing: false,
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
        <LeagueCard records={records.records} />
        <FesCard records={records.records} festivals={records.festivals} />
      </div>
    );
  }
}

const RecordsContainerIntl = injectIntl(RecordsContainer);

const Records = ({ splatnet }) => (
  <Container fluid style={{ marginTop: '1rem' }}>
    <Row>
      <Col md={12}>
        <RecordsContainerIntl splatnet={splatnet} />
      </Col>
    </Row>
  </Container>
);

const SubscribedRecords = () => {
  const splatnet = useSplatnet();
  return <Records splatnet={splatnet} />;
};

export default SubscribedRecords;
