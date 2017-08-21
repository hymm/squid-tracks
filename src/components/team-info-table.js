import React from 'react';
import { Table } from 'react-bootstrap';

const TeamHeader = ({ player = { player: {} } }) =>
  <thead>
    <tr>
      <th>Player</th>
      <th colSpan="1">Sort</th>
      <th colSpan="1">Star</th>
      <th colSpan="1">Weapon ID</th>
      <th colSpan="1">Player ID</th>
    </tr>
  </thead>;

const PlayerRow = ({ player }) => {
  return (
    <tr>
      <td>
        {player.player.nickname}
      </td>
      <td>
        {player.sort_score}
      </td>
      <td>
        {player.player.star_rank}
      </td>
      <td>
        {player.player.weapon.id}
      </td>
      <td>
        {player.player.principal_id}
      </td>
    </tr>
  );
};

const TeamInfoTable = ({ result, team }) => {
  return (
    <Table striped bordered condensed hover>
      <TeamHeader player={team[0]} />
      <tbody>
        {team.map(player =>
          <PlayerRow key={player.player.nickname} player={player} />
        )}
      </tbody>
    </Table>
  );
};

export default TeamInfoTable;
