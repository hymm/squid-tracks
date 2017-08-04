import React from 'react';
import { Panel, Table } from 'react-bootstrap';

const WeaponCard = ({ records }) => {
  const { weapon_stats = {} } = records;
  Object.keys(weapon_stats).forEach(weapon => {
    weapon_stats[weapon].total_count =
      weapon_stats[weapon].win_count + weapon_stats[weapon].lose_count;
    weapon_stats[weapon].percentage_count =
      weapon_stats[weapon].win_count / weapon_stats[weapon].total_count;
  });
  return (
    <Panel header={<h3>Weapon Stats</h3>}>
      <Table striped bordered condensed hover>
        <thead>
          <tr>
            <th>Weapon</th>
            <th>Total</th>
            <th>Wins</th>
            <th>Losses</th>
            <th>Percentage</th>
            <th>Paint</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(weapon_stats).map(weapon =>
            <tr key={weapon}>
              <td>
                {weapon_stats[weapon].weapon.name}
              </td>
              <td>
                {weapon_stats[weapon].total_count}
              </td>
              <td>
                {weapon_stats[weapon].win_count}
              </td>
              <td>
                {weapon_stats[weapon].lose_count}
              </td>
              <td>
                {weapon_stats[weapon].percentage_count.toFixed(2)}
              </td>
              <td style={{ textAlign: 'right' }}>
                {weapon_stats[weapon].total_paint_point}
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Panel>
  );
};

export default WeaponCard;
