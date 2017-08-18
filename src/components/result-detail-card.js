import React from 'react';
import { Grid, Row, Col, Panel, Table, Glyphicon } from 'react-bootstrap';
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

      {player.player.udemae
        ? <td>
            {`${player.player.udemae.name}${player.player.udemae.s_plus_number
              ? player.player.udemae.s_plus_number
              : player.player.udemae.name === 'S+' ? 0 : ''}`}
          </td>
        : null}
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

const TeamHeader = ({ player = { player: {} } }) =>
  <thead>
    <tr>
      <th>Player</th>
      {player.player.udemae ? <th>Rank</th> : null}
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
      <TeamHeader player={result.player_result} />
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
          {result.player_result.player.udemae ? <th /> : null}
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
      <TeamHeader player={result.other_team_members[0]} />
      <tbody>
        {result.other_team_members.map(player =>
          <PlayerRow key={player.player.nickname} player={player} />
        )}
      </tbody>
      <tfoot>
        <tr>
          <th>Totals</th>
          <th />
          {result.player_result.player.udemae ? <th /> : null}
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

const ResultDetailCard = ({ result, statInk }) => {
  const linkInfo = statInk[result.battle_number];
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
          <Col sm={6} md={6}>
            <h4>My Team</h4>
            <MyTeamTable result={result} />
          </Col>
          <Col sm={6} md={6}>
            <h4>Enemy Team</h4>
            <TheirTeamTable result={result} />
          </Col>
        </Row>
      </Grid>
    </Panel>
  );
};

export default ResultDetailCard;
