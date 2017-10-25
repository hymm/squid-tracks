import React from 'react';
import { Panel, Table, Image } from 'react-bootstrap';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
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
      weapon_stats[weapon].total_count =
        weapon_stats[weapon].win_count + weapon_stats[weapon].lose_count;
      weapon_stats[weapon].percentage_count =
        weapon_stats[weapon].win_count / weapon_stats[weapon].total_count;
      weaponArray.push(weapon_stats[weapon]);
    });

    sort(weaponArray, this.state.sortColumn, this.state.sortDirection);

    return (
      <Panel
        header={
          <h3>
            <FormattedMessage
              id="WeaponCard.title"
              defaultMessage="Weapon Stats"
            />
          </h3>
        }
      >
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
                    src={`https://app.splatoon2.nintendo.net${weapon.weapon
                      .thumbnail}`}
                    style={{ maxHeight: 30 }}
                    alt={weapon.weapon.name}
                  />
                </td>
                <td>{weapon.weapon.name}</td>
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
      </Panel>
    );
  }
}

export default injectIntl(WeaponCard);
