import React from 'react';
import {
  Grid,
  Row,
  Col,
  Panel,
  Table,
  Glyphicon,
  ButtonToolbar,
  ButtonGroup,
  Button
} from 'react-bootstrap';
import TeamStatsTable from './team-stats-table';
import TeamGearTable from './team-gear-table';
import TeamInfoTable from './team-info-table';
const { openExternal } = window.require('electron').remote.shell;

const ResultSummary = ({ result }) =>
  <Table striped bordered>
    <tbody>
      <tr>
        <th>Result</th>
        <td>
          {result.my_team_result.name}
        </td>
      </tr>
      <tr>
        <th>Game Mode</th>
        <td>
          {result.game_mode.name}
        </td>
      </tr>
      <tr>
        <th>Rule</th>
        <td>
          {result.rule.name}
        </td>
      </tr>
      <tr>
        <th>Stage</th>
        <td>
          {result.stage.name}
        </td>
      </tr>
    </tbody>
  </Table>;

const ResultSummary2 = ({ result }) =>
  <Table striped bordered>
    <tbody>
      <tr>
        <th>Start Time</th>
        <td>
          {new Date(result.start_time * 1000).toString()}
        </td>
      </tr>
      {result.elapsed_time
        ? <tr>
            <th>Duration</th>
            <td>
              {`${result.elapsed_time} sec`}
            </td>
          </tr>
        : null}
      {result.tag_id
        ? <tr>
            <th>Team Id</th>
            <td>
              {result.tag_id}
            </td>
          </tr>
        : null}
      {result.my_team_percentage
        ? <tr>
            <th>Score</th>
            <td>
              {`${result.my_team_percentage} - ${result.other_team_percentage}`}
            </td>
          </tr>
        : null}
      {result.my_team_count != null
        ? <tr>
            <th>Score</th>
            <td>{`${result.my_team_count} - ${result.other_team_count}`}</td>
          </tr>
        : null}
      {result.estimate_gachi_power
        ? <tr>
            <th>Estimate Gachi Power</th>
            <td>
              {result.estimate_gachi_power}
            </td>
          </tr>
        : null}
      {result.fes_power
        ? <tr>
            <th>Fes Power</th>
            <td>
              {result.fes_power}
            </td>
          </tr>
        : null}
      {result.my_estimate_league_point
        ? <tr>
            <th>My Estimate League Power</th>
            <td>
              {result.my_estimate_league_point}
            </td>
          </tr>
        : null}
      {result.league_point
        ? <tr>
            <th>League Points</th>
            <td>
              {result.league_point}
            </td>
          </tr>
        : null}
      {result.max_league_point && result.max_league_point > 0
        ? <tr>
            <th>Max League Points</th>
            <td>
              {result.max_league_point}
            </td>
          </tr>
        : null}
    </tbody>
  </Table>;

class ResultDetailCard extends React.Component {
  state = {
    show: 1
  };

  showStats = () => {
    this.setState({ show: 1 });
  };

  showGear = () => {
    this.setState({ show: 2 });
  };

  showInfo = () => {
    this.setState({ show: 3 });
  };

  render() {
    const { result, statInk } = this.props;
    const linkInfo = statInk[result.battle_number];
    if (!result) {
      return null;
    }

    const myTeam = result.my_team_members.slice(0);
    myTeam.unshift(result.player_result);
    myTeam.sort((a, b) => b.sort_score - a.sort_score);
    const otherTeam = result.other_team_members
      .slice(0)
      .sort((a, b) => b.sort_score - a.sort_score);

    return (
      <Panel
        header={
          <h3>
            {`Battle #${result.battle_number} Details`}
            {linkInfo
              ? <a
                  onClick={() =>
                    openExternal(
                      `https://stat.ink/@${linkInfo.username}/spl2/${linkInfo.battle}`
                    )}
                  style={{ cursor: 'pointer' }}
                >
                  <Glyphicon glyph={'ok-sign'} style={{ paddingLeft: 6 }} />
                </a>
              : null}
          </h3>
        }
      >
        <Grid fluid>
          <Row>
            <Col sm={6} md={6}>
              <ResultSummary result={result} />
            </Col>
            <Col sm={6} md={6}>
              <ResultSummary2 result={result} />
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <ButtonToolbar style={{ marginBottom: '10px' }}>
                <ButtonGroup>
                  <Button
                    onClick={this.showStats}
                    active={this.state.show === 1}
                  >
                    Stats
                  </Button>
                  <Button
                    onClick={this.showGear}
                    active={this.state.show === 2}
                  >
                    Gear
                  </Button>
                  <Button
                    onClick={this.showInfo}
                    active={this.state.show === 3}
                  >
                    More Info
                  </Button>
                </ButtonGroup>
              </ButtonToolbar>
            </Col>
          </Row>
          <Row>
            <Col sm={6} md={6}>
              <h4>My Team</h4>
              {this.state.show === 1 ? <TeamStatsTable team={myTeam} /> : null}
              {this.state.show === 2 ? <TeamGearTable team={myTeam} /> : null}
              {this.state.show === 3 ? <TeamInfoTable team={myTeam} /> : null}
            </Col>
            <Col sm={6} md={6}>
              <h4>Enemy Team</h4>
              {this.state.show === 1
                ? <TeamStatsTable team={otherTeam} />
                : null}
              {this.state.show === 2
                ? <TeamGearTable team={otherTeam} />
                : null}
              {this.state.show === 3
                ? <TeamInfoTable team={otherTeam} />
                : null}
            </Col>
          </Row>
        </Grid>
      </Panel>
    );
  }
}

export default ResultDetailCard;
