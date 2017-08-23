import React from 'react';
import { Panel, Table, Image, Glyphicon } from 'react-bootstrap';
import { sort } from './sort-array';
import TableHeader from './table-header';

export default class ResultsCard extends React.Component {
  state = {
    sortColumn: 'battle_number',
    sortDirection: 'up'
  };

  static columnHeaders = [
    {
      text: 'Battle',
      sortColumn: 'battle_number',
      sortDirection: 'up',
      sortFunction: parseFloat
    },
    { text: 'Mode', sortColumn: 'game_mode.key', sortDirection: 'down' },
    { text: 'Rule', sortColumn: 'rule.key', sortDirection: 'down' },
    { text: 'Stage', sortColumn: 'stage.name', sortDirection: 'down' },
    {
      text: '',
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
    const { results, changeResult, statInk } = this.props;
    results.forEach(
      result =>
        (result.k_a =
          result.player_result.kill_count + result.player_result.assist_count)
    );

    const sortedResults = results.slice();

    sort(
      sortedResults,
      this.state.sortColumn,
      this.state.sortDirection,
      this.state.sortFunction
    );
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
                    sortDirection: header.sortDirection,
                    sortFunction: header.sortFunction
                  }}
                  text={header.text}
                  sortColumn={this.state.sortColumn}
                />
              )}
            </tr>
          </thead>
          <tbody>
            {sortedResults.map(result => {
              const linkInfo = statInk[result.battle_number];
              return (
                <tr key={result.start_time}>
                  <td>
                    <a
                      onClick={() => {
                        document.body.scrollTop = 0;
                        changeResult(result.battle_number);
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      {result.battle_number}
                    </a>
                    {linkInfo
                      ? <Glyphicon
                          glyph={'ok-sign'}
                          style={{ paddingLeft: 6 }}
                        />
                      : null}
                  </td>
                  <td>
                    {result.game_mode.key}
                  </td>
                  <td>
                    {result.rule.name}
                  </td>
                  <td>
                    {result.stage.name}
                  </td>
                  <td style={{ textAlign: 'center', background: 'darkgrey' }}>
                    <Image
                      src={`https://app.splatoon2.nintendo.net${result
                        .player_result.player.weapon.thumbnail}`}
                      style={{ maxHeight: 30 }}
                      alt={result.player_result.player.weapon.name}
                    />
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
