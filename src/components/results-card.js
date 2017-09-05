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
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import { sort } from './sort-array';
import TableHeader from './table-header';

class ResultsCard extends React.Component {
  messages = defineMessages({
    battleNumber: {
      id: 'results.table.header.battleNumber',
      defaultMessage: 'Battle'
    },
    mode: {
      id: 'results.table.header.gameMode',
      defaultMessage: 'Mode'
    },
    rule: {
      id: 'results.table.header.rule',
      defaultMessage: 'Rule'
    },
    stage: {
      id: 'results.table.header.stage',
      defaultMessage: 'Stage'
    },
    winLoss: {
      id: 'results.table.header.result',
      defaultMessage: 'W/L'
    },
    power: {
      id: 'results.table.header.power',
      defaultMessage: 'Power'
    },
    paint: {
      id: 'results.table.header.paint',
      defaultMessage: 'Paint'
    },
    ka: {
      id: 'results.table.header.killsAndAssists',
      defaultMessage: 'K+A'
    },
    k: {
      id: 'results.table.header.kills',
      defaultMessage: 'K'
    },
    a: {
      id: 'results.table.header.assists',
      defaultMessage: 'A'
    },
    d: {
      id: 'results.table.header.deaths',
      defaultMessage: 'D'
    },
    s: {
      id: 'results.table.header.specials',
      defaultMessage: 'S'
    }
  });

  state = {
    sortColumn: 'battle_number',
    sortDirection: 'up',
    sortFunction: parseFloat,
    normalize: false,
    normalizeTime: 5
  };

  columnHeaders = [
    {
      text: this.props.intl.formatMessage(this.messages.battleNumber),
      sortColumn: 'battle_number',
      sortDirection: 'up',
      sortFunction: parseFloat
    },
    {
      text: this.props.intl.formatMessage(this.messages.mode),
      sortColumn: 'game_mode.key',
      sortDirection: 'down'
    },
    {
      text: this.props.intl.formatMessage(this.messages.rule),
      sortColumn: 'rule.key',
      sortDirection: 'down'
    },
    {
      text: this.props.intl.formatMessage(this.messages.stage),
      sortColumn: 'stage.name',
      sortDirection: 'down'
    },
    {
      text: this.props.intl.formatMessage(this.messages.winLoss),
      sortColumn: 'my_team_result.key',
      sortDirection: 'up'
    },
    {
      text: this.props.intl.formatMessage(this.messages.power),
      sortColumn: 'estimate_gachi_power',
      sortDirection: 'up'
    },
    {
      text: '',
      sortColumn: 'player_result.player.weapon.name',
      sortDirection: 'down'
    },
    {
      text: this.props.intl.formatMessage(this.messages.paint),
      sortColumn: 'player_result.game_paint_point',
      sortDirection: 'up'
    },
    {
      text: this.props.intl.formatMessage(this.messages.ka),
      sortColumn: 'k_a',
      sortDirection: 'up'
    },
    {
      text: this.props.intl.formatMessage(this.messages.k),
      sortColumn: 'player_result.kill_count',
      sortDirection: 'up'
    },
    {
      text: this.props.intl.formatMessage(this.messages.a),
      sortColumn: 'player_result.assist_count',
      sortDirection: 'up'
    },
    {
      text: this.props.intl.formatMessage(this.messages.d),
      sortColumn: 'player_result.death_count',
      sortDirection: 'up'
    },
    {
      text: this.props.intl.formatMessage(this.messages.s),
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

    const columnHeaders = this.columnHeaders;
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
              <FormattedMessage
                id="results.table.button.raw"
                defaultMessage="Raw"
              />
            </Button>
            <SplitButton
              title={
                <FormattedMessage
                  id="results.table.button.normalize"
                  defaultMessage="Normalize to {normalizeTime} minutes"
                  values={{ normalizeTime }}
                />
              }
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
        <FormattedMessage
          id="results.table.sortHelp"
          defaultMessage="* Click on column headers to sort"
        />
        <Table striped bordered condensed hover>
          <thead>
            <tr>
              {columnHeaders.map(header =>
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
                    {result.other_estimate_league_power
                      ? results.other_estimate_league_power
                      : result.estimate_gachi_power
                        ? result.estimate_gachi_power
                        : result.other_estimate_fes_power
                          ? result.other_estimate_fes_power
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

export default injectIntl(ResultsCard);
