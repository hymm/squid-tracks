import React from 'react';
import PropTypes from 'proptypes';
import { Grid, Row, Col, Panel, Table } from 'react-bootstrap';
import StageCard from './components/stage-card';
const remote = window.require('electron').remote;
const { getApi } = remote.require('./main.js');

const CustomSplatnet = () =>
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

const ResultsViewer = ({ records }) =>
  <div>
    <PlayerCard records={records.records} />
  </div>;

ResultsViewer.propTypes = {
  records: PropTypes.object.isRequired
};

const PlayerCard = ({ records }) =>
  <Panel header={<h3>Player Card</h3>}>
    <div>{`Nickname: ${records.player.nickname}`}</div>
    <div>{`RM: ${records.player.udemae_rainmaker.name} ${records.player
      .udemae_rainmaker.s_plus_number}`}</div>
    <div>{`TC: ${records.player.udemae_tower.name} ${records.player.udemae_tower
      .s_plus_number}`}</div>
    <div>{`SZ: ${records.player.udemae_zones.name} ${records.player.udemae_zones
      .s_plus_number}`}</div>
    <div>{`Wins: ${records.win_count}`}</div>
    <div>{`Losses: ${records.lose_count}`}</div>
  </Panel>;

const WeaponCard = ({ records }) => {
  const { weapon_stats = {} } = records;
  Object.keys(weapon_stats).forEach(weapon => {
    weapon_stats[weapon].total_count =
      weapon_stats[weapon].win_count + weapon_stats[weapon].lose_count;
    weapon_stats[weapon].percentage_count =
      weapon_stats[weapon].win_count / weapon_stats[weapon].total_count;
  });
  return (
    <Panel header={<h3>Weapon Stats</h3>}>
      <Table striped bordered condensed hover>
        <thead>
          <tr>
            <th>Weapon</th>
            <th>Total</th>
            <th>Wins</th>
            <th>Losses</th>
            <th>Percentage</th>
            <th>Paint</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(weapon_stats).map(weapon =>
            <tr key={weapon}>
              <td>
                {weapon_stats[weapon].weapon.name}
              </td>
              <td>
                {weapon_stats[weapon].total_count}
              </td>
              <td>
                {weapon_stats[weapon].win_count}
              </td>
              <td>
                {weapon_stats[weapon].lose_count}
              </td>
              <td>
                {weapon_stats[weapon].percentage_count.toFixed(2)}
              </td>
              <td style={{ textAlign: 'right' }}>
                {weapon_stats[weapon].total_paint_point}
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Panel>
  );
};

export default CustomSplatnet;
