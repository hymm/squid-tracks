import React from 'react';
import { Panel, Table } from 'react-bootstrap';

const ResultsCard = ({ results }) => {
  /* Object.keys(results).forEach(weapon => {
    weapon_stats[weapon].total_count =
      weapon_stats[weapon].win_count + weapon_stats[weapon].lose_count;
    weapon_stats[weapon].percentage_count =
      weapon_stats[weapon].win_count / weapon_stats[weapon].total_count;
  }); */
  return (
    <Panel header={<h3>Results</h3>}>
      <Table striped bordered condensed hover>
        <thead>
          <tr>
            <th>Start Time</th>
            <th>Mode</th>
            <th>Rule</th>
            <th>Stage</th>
            <th>Weapon</th>
            <th>
              {'W/L'}
            </th>
            <th>Paint</th>
            <th>K+A</th>
            <th>K</th>
            <th>A</th>
            <th>D</th>
            <th>Sp</th>
          </tr>
        </thead>
        <tbody>
          {results.map(result => {
            return (
              <tr key={result.start_time}>
                <td>
                  {result.start_time}
                </td>
                <td>
                  {result.battle_number}
                </td>
                <td>
                  {result.game_mode.key}
                </td>
                <td>
                  {result.rule.key}
                </td>
                <td>
                  {result.stage.name}
                </td>
                <td>
                  {result.player_result.player.weapon.name}
                </td>
                <td>
                  {result.my_team_result.key}
                </td>
                <td>
                  {result.player_result.game_paint_point}
                </td>
                <td>
                  {result.player_result.kill_count +
                    result.player_result.assist_count}
                </td>
                <td>
                  {result.player_result.kill_count}
                </td>
                <td>
                  {result.player_result.assist_count}
                </td>
                <td>
                  {result.player_result.death_count}
                </td>
                <td>
                  {result.player_result.special_count}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Panel>
  );
};

export default ResultsCard;
