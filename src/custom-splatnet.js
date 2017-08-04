import React from 'react';
import PropTypes from 'proptypes';
import { Grid, Row, Col, Panel, Table, } from 'react-bootstrap';
const remote = window.require('electron').remote;
const { getApi, } = remote.require('./main.js');

const CustomSplatnet = () => (
  <Grid fluid>
    <Row>
      <Col md={12}>
        <ResultsContainer />
      </Col>
    </Row>
  </Grid>
);

class ResultsContainer extends React.Component {
  state = {
    records: {
      records: {
        player: {
          nickname: '',
          udemae_rainmaker: { name: '', number: 0, s_plus_number: null },
          udemae_tower: { name: '', number: 0, s_plus_number: null, },
          udemae_zones: { name: '', number: 0, s_plus_number: null, },
        },
        stage_stats: {},
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
            </div>
        );
    }
}

const ResultsViewer = ({ records }) => (
    <div>
        <PlayerCard records={records.records} />
    </div>
);

ResultsViewer.propTypes = {
    records: PropTypes.object.isRequired,
};

const PlayerCard = ({ records }) => (
    <Panel header={<h3>Player Card</h3>}>
      <div>{`Nickname: ${records.player.nickname}`}</div>
      <div>{`RM: ${records.player.udemae_rainmaker.name} ${records.player.udemae_rainmaker.s_plus_number}`}</div>
      <div>{`TC: ${records.player.udemae_tower.name} ${records.player.udemae_tower.s_plus_number}`}</div>
      <div>{`SZ: ${records.player.udemae_zones.name} ${records.player.udemae_zones.s_plus_number}`}</div>
      <div>{`Wins: ${records.win_count}`}</div>
      <div>{`Losses: ${records.lose_count}`}</div>
    </Panel>
);

const StageCard = ({ records }) => {
  const { stage_stats = {} } = records;
  return (
    <Panel header={<h3>Player Card</h3>}>
      <Table striped bordered condensed hover>
        <tr>
          <th>Name</th>
          <th>RM Win</th>
          <th>RM Lose</th>
          <th>SZ Win</th>
          <th>SZ Lose</th>
          <th>TC Win</th>
          <th>TC Lose</th>
        </tr>
        {Object.keys(stage_stats).map((stage) => (
          <tr>
            <td>{stage_stats[stage].stage.name}</td>
            <td>{stage_stats[stage].hoko_win}</td>
            <td>{stage_stats[stage].hoko_lose}</td>
            <td>{stage_stats[stage].area_win}</td>
            <td>{stage_stats[stage].area_lose}</td>
            <td>{stage_stats[stage].yagura_win}</td>
            <td>{stage_stats[stage].yagura_lose}</td>
          </tr>
        ))}
      </Table>
    </Panel>
  );
};

export default CustomSplatnet;
