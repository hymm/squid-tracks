import React from 'react';
import { Panel, Table } from 'react-bootstrap';
import { sort } from './sort-array';
import TableHeader from './table-header';

export default class ResultsCard extends React.Component {
  state = {
    sortColumn: 'battle_number',
    sortDirection: 'up'
  };

  static columnHeaders = [
    { text: 'Battle', sortColumn: 'battle_number', sortDirection: 'up' },
    { text: 'Mode', sortColumn: 'game_mode.key', sortDirection: 'down' },
    { text: 'Rule', sortColumn: 'rule.key', sortDirection: 'down' },
    { text: 'Stage', sortColumn: 'stage.name', sortDirection: 'down' },
    {
      text: 'Weapon',
      sortColumn: 'player_result.player.weapon.name',
      sortDirection: 'down'
    },
    { text: 'W/L', sortColumn: 'my_team_result.key', sortDirection: 'up' },
    {
      text: 'Paint',
      sortColumn: 'player_result.game_paint_point',
      sortDirection: 'up'
    },
    { text: 'K+A', sortColumn: 'k_a', sortDirection: 'up' },
    { text: 'K', sortColumn: 'player_result.kill_count', sortDirection: 'up' },
    {
      text: 'A',
      sortColumn: 'player_result.assist_count',
      sortDirection: 'up'
    },
    { text: 'D', sortColumn: 'player_result.death_count', sortDirection: 'up' },
    {
      text: 'S',
      sortColumn: 'player_result.special_count',
      sortDirection: 'up'
    }
  ];

  render() {
    const { results, changeResult } = this.props;
    results.forEach(
      result =>
        (result.k_a =
          result.player_result.kill_count + result.player_result.assist_count)
    );

    sort(results, this.state.sortColumn, this.state.sortDirection);
    return (
      <Panel header={<h3>Last 50 Battles</h3>}>
        * Click on column headers to sort
        <Table striped bordered condensed hover>
          <thead>
            <tr>
              {ResultsCard.columnHeaders.map(header =>
                <TableHeader
                  key={header.text}
                  setState={this.setState.bind(this)}
                  sort={{
                    sortColumn: header.sortColumn,
                    sortDirection: header.sortDirection
                  }}
                  text={header.text}
                  sortColumn={this.state.sortColumn}
                />
              )}
            </tr>
          </thead>
          <tbody>
            {results.map(result => {
              return (
                <tr key={result.start_time}>
                  <td>
                    <a
                      onClick={() => {
                        document.body.scrollTop = 0;
                        changeResult(result.battle_number);
                      }}
                    >
                      {result.battle_number}
                    </a>
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
                    {result.k_a}
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
  }
}
