import React from 'react';
import {
  Panel,
  Table,
  Image,
  Glyphicon,
  ButtonToolbar,
  ButtonGroup,
  Button,
  SplitButton,
  MenuItem
} from 'react-bootstrap';
import { cloneDeep } from 'lodash';
import { sort } from './sort-array';
import TableHeader from './table-header';

export default class ResultsCard extends React.Component {
  state = {
    sortColumn: 'battle_number',
    sortDirection: 'up',
    normalize: false,
    normalizeTime: 5
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
    { text: 'W/L', sortColumn: 'my_team_result.key', sortDirection: 'up' },
    { text: 'Power', sortColumn: 'estimate_gachi_power', sortDirection: 'up' },
    {
      text: '',
      sortColumn: 'player_result.player.weapon.name',
      sortDirection: 'down'
    },
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

  normalize(results) {
    if (!this.state.normalize) {
      return;
    }

    const { normalizeTime } = this.state;

    results.forEach(result => {
      // assume is turf war if elapsed_time is not defined
      const time = result.elapsed_time ? result.elapsed_time : 180;
      result.player_result.game_paint_point =
        result.player_result.game_paint_point * 60 * normalizeTime / time;
      result.player_result.kill_count =
        result.player_result.kill_count * 60 * normalizeTime / time;
      result.player_result.assist_count =
        result.player_result.assist_count * 60 * normalizeTime / time;
      result.player_result.death_count =
        result.player_result.death_count * 60 * normalizeTime / time;
      result.player_result.special_count =
        result.player_result.special_count * 60 * normalizeTime / time;
    });
  }

  render() {
    const { results, changeResult, statInk } = this.props;
    const { normalize, normalizeTime } = this.state;
    const sortedResults = cloneDeep(results);
    this.normalize(sortedResults);

    sortedResults.forEach(
      result =>
        (result.k_a =
          result.player_result.kill_count + result.player_result.assist_count)
    );

    sort(
      sortedResults,
      this.state.sortColumn,
      this.state.sortDirection,
      this.state.sortFunction
    );

    return (
      <Panel header={<h3>Last 50 Battles</h3>}>
        <ButtonToolbar style={{ marginBottom: '10px' }}>
          <ButtonGroup>
            <Button
              onClick={() => this.setState({ normalize: false })}
              active={!normalize}
            >
              Raw
            </Button>
            <SplitButton
              title={`Normalize to ${normalizeTime} minutes`}
              onClick={() => this.setState({ normalize: true })}
              active={normalize}
              id="minutes"
            >
              <MenuItem onClick={() => this.setState({ normalizeTime: 1 })}>
                1
              </MenuItem>
              <MenuItem onClick={() => this.setState({ normalizeTime: 3 })}>
                3
              </MenuItem>
              <MenuItem onClick={() => this.setState({ normalizeTime: 5 })}>
                5
              </MenuItem>
            </SplitButton>
          </ButtonGroup>
        </ButtonToolbar>
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
                  <td>
                    {result.my_team_result.key}
                  </td>
                  <td>
                    {result.estimate_gachi_power
                      ? result.estimate_gachi_power
                      : '---'}
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
                    {result.player_result.game_paint_point.toFixed(0)}
                  </td>
                  <td>
                    {result.k_a.toFixed(normalize ? 1 : 0)}
                  </td>
                  <td>
                    {result.player_result.kill_count.toFixed(normalize ? 1 : 0)}
                  </td>
                  <td>
                    {result.player_result.assist_count.toFixed(
                      normalize ? 1 : 0
                    )}
                  </td>
                  <td>
                    {result.player_result.death_count.toFixed(
                      normalize ? 1 : 0
                    )}
                  </td>
                  <td>
                    {result.player_result.special_count.toFixed(
                      normalize ? 1 : 0
                    )}
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
