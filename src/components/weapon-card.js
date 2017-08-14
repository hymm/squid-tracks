import React from 'react';
import { Panel, Table } from 'react-bootstrap';
import { sort } from './sort-array';
import TableHeader from './table-header';

export default class WeaponCard extends React.Component {
  state = {
    sortColumn: 'percentage_count',
    sortDirection: 'up'
  };

  static columnHeaders = [
    { text: 'Weapon', sortColumn: 'weapon.name', sortDirection: 'down' },
    { text: 'Total', sortColumn: 'total_count', sortDirection: 'up' },
    { text: 'Wins', sortColumn: 'win_count', sortDirection: 'up' },
    { text: 'Losses', sortColumn: 'lose_count', sortDirection: 'up' },
    { text: 'Percentage', sortColumn: 'percentage_count', sortDirection: 'up' },
    { text: 'Paint', sortColumn: 'total_paint_point', sortDirection: 'up' }
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
      <Panel header={<h3>Weapon Stats</h3>}>
        * Click on column headers to sort
        <Table striped bordered condensed hover>
          <thead>
            <tr>
              {WeaponCard.columnHeaders.map(header =>
                <TableHeader
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
            {weaponArray.map(weapon =>
              <tr key={weapon.weapon.name}>
                <td>
                  {weapon.weapon.name}
                </td>
                <td>
                  {weapon.total_count}
                </td>
                <td>
                  {weapon.win_count}
                </td>
                <td>
                  {weapon.lose_count}
                </td>
                <td>
                  {weapon.percentage_count.toFixed(2)}
                </td>
                <td style={{ textAlign: 'right' }}>
                  {weapon.total_paint_point}
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Panel>
    );
  }
}
