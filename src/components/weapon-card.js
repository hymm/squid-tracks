import React from 'react';
import { Panel, Table } from 'react-bootstrap';

export default class WeaponCard extends React.Component {
  state = {
    sortColumn: '',
    sortDirection: 'up'
  };

  getValue(obj, valuePath) {
    const splitPath = valuePath.split('.');
    if (splitPath.length <= 1) {
      return obj[valuePath];
    }
    let value = undefined;
    for (const path of splitPath) {
      value = value ? value[path] : obj[path];
    }
    return value;
  }

  sort(array, sortColumn) {
    if (sortColumn.length < 1) {
      return array;
    }

    array.sort((a, b) => {
      if (this.getValue(a, sortColumn) > this.getValue(b, sortColumn)) {
        return this.state.sortDirection === 'up' ? -1 : 1;
      }
      if (this.getValue(a, sortColumn) < this.getValue(b, sortColumn)) {
        return this.state.sortDirection === 'up' ? 1 : -1;
      }
      return 0;
    });
    return array;
  }

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

    this.sort(weaponArray, this.state.sortColumn);

    return (
      <Panel header={<h3>Weapon Stats</h3>}>
        <Table striped bordered condensed hover>
          <thead>
            <tr>
              <th
                onClick={() =>
                  this.setState({
                    sortColumn: 'weapon.name',
                    sortDirection: 'down'
                  })}
              >
                Weapon
              </th>
              <th
                onClick={() =>
                  this.setState({
                    sortColumn: 'total_count',
                    sortDirection: 'up'
                  })}
              >
                Total
              </th>
              <th
                onClick={() =>
                  this.setState({
                    sortColumn: 'win_count',
                    sortDirection: 'up'
                  })}
              >
                Wins
              </th>
              <th
                onClick={() =>
                  this.setState({
                    sortColumn: 'lose_count',
                    sortDirection: 'up'
                  })}
              >
                Losses
              </th>
              <th
                onClick={() =>
                  this.setState({
                    sortColumn: 'percentage_count',
                    sortDirection: 'up'
                  })}
              >
                Percentage
              </th>
              <th
                onClick={() =>
                  this.setState({
                    sortColumn: 'total_paint_point',
                    sortDirection: 'up'
                  })}
              >
                Paint
              </th>
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
