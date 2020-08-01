import React from 'react';
import update from 'immutability-helper';
import { Panel, Table, Image } from 'react-bootstrap';
import {
  defineMessages,
  injectIntl,
  FormattedMessage,
  FormattedDate
} from 'react-intl';
import { sort } from './sort-array';
import TableHeader from './table-header';

class WeaponCard extends React.Component {
  state = {
    sortColumn: 'percentage_count',
    sortDirection: 'up'
  };

  messages = defineMessages({
    weapon: {
      id: 'WeaponCard.header.weapon',
      defaultMessage: 'Weapon'
    },
    total: {
      id: 'WeaponCard.header.total',
      defaultMessage: 'Total'
    },
    wins: {
      id: 'WeaponCard.header.wins',
      defaultMessage: 'Wins'
    },
    losses: {
      id: 'WeaponCard.header.losses',
      defaultMessage: 'Losses'
    },
    percentage: {
      id: 'WeaponCard.header.percentage',
      defaultMessage: 'Percentage'
    },
    paint: {
      id: 'WeaponCard.header.paint',
      defaultMessage: 'Paint'
    },
    lastUsed: {
      id: 'WeaponCard.header.lastUsed',
      defaultMessage: 'Last Used'
    },
    winMeter: {
      id: 'WeaponCard.header.winMeter',
      defaultMessage: '⚑'
    },
    maxWinMeter: {
      id: 'WeaponCard.header.maxWinMeter',
      defaultMessage: 'Max ⚑'
    }
  });

  columnHeaders = [
    { text: '', noSort: true },
    {
      text: this.props.intl.formatMessage(this.messages.weapon),
      sortColumn: 'weapon.name',
      sortDirection: 'down'
    },
    {
      text: this.props.intl.formatMessage(this.messages.lastUsed),
      sortColumn: 'last_use_time',
      sortDirection: 'up'
    },
    {
      text: this.props.intl.formatMessage(this.messages.winMeter),
      sortColumn: 'win_meter',
      sortDirection: 'up'
    },
    {
      text: this.props.intl.formatMessage(this.messages.maxWinMeter),
      sortColumn: 'max_win_meter',
      sortDirection: 'up'
    },
    {
      text: this.props.intl.formatMessage(this.messages.total),
      sortColumn: 'total_count',
      sortDirection: 'up'
    },
    {
      text: this.props.intl.formatMessage(this.messages.wins),
      sortColumn: 'win_count',
      sortDirection: 'up'
    },
    {
      text: this.props.intl.formatMessage(this.messages.losses),
      sortColumn: 'lose_count',
      sortDirection: 'up'
    },
    {
      text: this.props.intl.formatMessage(this.messages.percentage),
      sortColumn: 'percentage_count',
      sortDirection: 'up'
    },
    {
      text: this.props.intl.formatMessage(this.messages.paint),
      sortColumn: 'total_paint_point',
      sortDirection: 'up'
    }
  ];

  render() {
    const { records } = this.props;
    const { weapon_stats = {} } = records;
    const weaponArray = [];
    Object.keys(weapon_stats).forEach(weapon => {
      const calcStats = {};
      calcStats.total_count =
        weapon_stats[weapon].win_count + weapon_stats[weapon].lose_count;
      calcStats.percentage_count =
        weapon_stats[weapon].win_count / calcStats.total_count;
      weaponArray.push(update(calcStats, { $merge: weapon_stats[weapon] }));
    });

    sort(weaponArray, this.state.sortColumn, this.state.sortDirection);

    return (
      <Panel>
        <Panel.Heading>
          <FormattedMessage
            id="WeaponCard.title"
            defaultMessage="Weapon Stats"
          />
        </Panel.Heading>
        <Panel.Body>
          <FormattedMessage
            id="WeaponCard.sortHelp"
            defaultMessage="* Click on column headers to sort"
          />

          <Table striped bordered condensed hover>
            <thead>
              <tr>
                {this.columnHeaders.map(header => {
                  return header.noSort ? (
                    <th key={header.text}>{header.text}</th>
                  ) : (
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
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {weaponArray.map(weapon => (
                <tr key={weapon.weapon.name}>
                  <td
                    style={{
                      width: 50,
                      textAlign: 'center',
                      background: 'darkgrey'
                    }}
                  >
                    <Image
                      src={`https://app.splatoon2.nintendo.net${weapon.weapon.thumbnail}`}
                      style={{ maxHeight: 30 }}
                      alt={weapon.weapon.name}
                    />
                  </td>
                  <td>{weapon.weapon.name}</td>
                  <td>
                    <FormattedDate
                      value={new Date(weapon.last_use_time * 1000)}
                      year="numeric"
                      month="numeric"
                      day="2-digit"
                    />
                  </td>
                  <td>{weapon.win_meter}</td>
                  <td>{weapon.max_win_meter}</td>
                  <td>{weapon.total_count}</td>
                  <td>{weapon.win_count}</td>
                  <td>{weapon.lose_count}</td>
                  <td>{weapon.percentage_count.toFixed(2)}</td>
                  <td style={{ textAlign: 'right' }}>
                    {weapon.total_paint_point}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Panel.Body>
      </Panel>
    );
  }
}

export default injectIntl(WeaponCard);
