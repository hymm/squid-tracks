import React from 'react';
import { Grid, Row, Col, Panel, Table } from 'react-bootstrap';

const ResultSummary = ({ result }) =>
  <Table striped bordered>
    <tbody>
      <tr>
        <th>Number</th>
        <td>
          {result.battle_number}
        </td>
      </tr>
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
          {result.start_time}
        </td>
      </tr>
      {result.elapsed_time
        ? <tr>
            <th>Elapsed Time</th>
            <td>
              {result.elapsed_time}
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
            <td
            >{`${result.my_team_percentage} - ${result.other_team_percentage}`}</td>
          </tr>
        : null}
      {result.my_team_count
        ? <tr>
            <th>Score</th>
            <td>{`${result.my_team_count} - ${result.other_team_count}`}</td>
          </tr>
        : null}
      {result.estimate_gachi_power
        ? <tr>
            <th>Estimate Power</th>
            <td>
              {result.estimate_gachi_power}
            </td>
          </tr>
        : null}
      {result.fes_power
        ? <tr>
            <th>Power</th>
            <td>
              {result.fes_power}
            </td>
          </tr>
        : null}
      {result.my_estimate_league_point
        ? <tr>
            <th>Estimate League Power</th>
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

const PlayerRow = ({ player }) => {
  return (
    <tr>
      <td>
        {player.player.nickname}
      </td>
      <td>
        {player.player.weapon.name}
      </td>
      <td>
        {player.game_paint_point}
      </td>
      <td>
        {player.kill_count + player.assist_count}
      </td>
      <td>
        {player.kill_count}
      </td>
      <td>
        {player.assist_count}
      </td>
      <td>
        {player.death_count}
      </td>
      <td>
        {player.special_count}
      </td>
    </tr>
  );
};

const TeamHeader = () =>
  <thead>
    <tr>
      <th>Nickname</th>
      <th>Weapon</th>
      <th>Inked</th>
      <th>K+A</th>
      <th>K</th>
      <th>A</th>
      <th>D</th>
      <th>S</th>
    </tr>
  </thead>;

const MyTeamTable = ({ result }) => {
  const total_k =
    result.my_team_members.reduce((sum, player) => sum + player.kill_count, 0) +
    result.player_result.kill_count;
  const total_a =
    result.my_team_members.reduce(
      (sum, player) => sum + player.assist_count,
      0
    ) + result.player_result.assist_count;

  return (
    <Table striped bordered condensed hover>
      <TeamHeader />
      <tbody>
        <PlayerRow player={result.player_result} />
        {result.my_team_members.map(player =>
          <PlayerRow key={player.player.nickname} player={player} />
        )}
      </tbody>
      <tfoot>
        <tr>
          <th>Totals</th>
          <th />
          <td>
            {result.my_team_members.reduce(
              (sum, player) => sum + player.game_paint_point,
              0
            ) + result.player_result.game_paint_point}
          </td>
          <td>
            {total_k + total_a}
          </td>
          <td>
            {total_k}
          </td>
          <td>
            {total_a}
          </td>
          <td>
            {result.my_team_members.reduce(
              (sum, player) => sum + player.death_count,
              0
            ) + result.player_result.death_count}
          </td>
          <td>
            {result.my_team_members.reduce(
              (sum, player) => sum + player.special_count,
              0
            ) + result.player_result.special_count}
          </td>
        </tr>
      </tfoot>
    </Table>
  );
};

const TheirTeamTable = ({ result }) => {
  const total_k = result.other_team_members.reduce(
    (sum, player) => sum + player.kill_count,
    0
  );
  const total_a = result.other_team_members.reduce(
    (sum, player) => sum + player.assist_count,
    0
  );

  return (
    <Table striped bordered condensed hover>
      <TeamHeader />
      <tbody>
        {result.other_team_members.map(player =>
          <PlayerRow key={player.player.nickname} player={player} />
        )}
      </tbody>
      <tfoot>
        <tr>
          <th>Totals</th>
          <th />
          <td>
            {result.other_team_members.reduce(
              (sum, player) => sum + player.game_paint_point,
              0
            )}
          </td>
          <td>
            {total_k + total_a}
          </td>
          <td>
            {total_k}
          </td>
          <td>
            {total_a}
          </td>
          <td>
            {result.other_team_members.reduce(
              (sum, player) => sum + player.death_count,
              0
            )}
          </td>
          <td>
            {result.other_team_members.reduce(
              (sum, player) => sum + player.special_count,
              0
            )}
          </td>
        </tr>
      </tfoot>
    </Table>
  );
};

const ResultDetailCard = ({ result }) => {
  return (
    <Panel header={<h3>Result Details</h3>}>
      <Grid fluid>
        <Row>
          <Col sm={6} md={6}>
            <h4>Summary</h4>
            <ResultSummary result={result} />
          </Col>
          <Col sm={6} md={6}>
            <h4>More Summary</h4>
            <ResultSummary2 result={result} />
          </Col>
        </Row>
        <Row>
          <Col sm={6} md={6}>
            <h4>My Team</h4>
            <MyTeamTable result={result} />
          </Col>
          <Col sm={6} md={6}>
            <h4>Their Team</h4>
            <TheirTeamTable result={result} />
          </Col>
        </Row>
      </Grid>
    </Panel>
  );
};

export default ResultDetailCard;
