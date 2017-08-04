import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import StageCard from './components/stage-card';
import PlayerCard from './components/player-card';
import WeaponCard from './components/weapon-card';
const remote = window.require('electron').remote;
const { getApi } = remote.require('./main.js');

const Records = () =>
  <Grid fluid>
    <Row>
      <Col md={12}>
        <ResultsContainer />
      </Col>
    </Row>
  </Grid>;

class ResultsContainer extends React.Component {
  state = {
    records: {
      records: {
        player: {
          nickname: '',
          udemae_rainmaker: { name: '', number: 0, s_plus_number: null },
          udemae_tower: { name: '', number: 0, s_plus_number: null },
          udemae_zones: { name: '', number: 0, s_plus_number: null }
        },
        stage_stats: {}
      }
    }
  };

  componentDidMount() {
    this.getRecords();
  }

  async getRecords() {
    const records = await getApi('records');
    this.setState({ records: records });
  }

  render() {
    return (
      <div>
        <PlayerCard records={this.state.records.records} />
        <StageCard records={this.state.records.records} />
        <WeaponCard records={this.state.records.records} />
      </div>
    );
  }
}

export default Records;
