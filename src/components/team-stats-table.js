import React from 'react';
import { Table, Image } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';

const TeamHeader = ({ player = { player: {} } }) => (
  <thead>
    <tr>
      <th>
        <FormattedMessage
          id="resultDetails.teamStats.header.player"
          defaultMessage="Player"
        />
      </th>
      {player.player.udemae ? (
        <th>
          <FormattedMessage
            id="resultDetails.teamStats.header.rank"
            defaultMessage="Rank"
          />
        </th>
      ) : null}
      <th />
      <th>
        <FormattedMessage
          id="resultDetails.teamStats.header.inked"
          defaultMessage="Inked"
        />
      </th>
      <th>
        <FormattedMessage
          id="resultDetails.teamStats.header.killsAndAssists"
          defaultMessage="K+A (A)"
        />
      </th>
      <th>
        <FormattedMessage
          id="resultDetails.teamStats.header.killsAndDeaths"
          defaultMessage="K / D"
        />
      </th>
      <th>
        <FormattedMessage
          id="resultDetails.teamStats.header.specials"
          defaultMessage="S"
        />
      </th>
    </tr>
  </thead>
);

const PlayerRow = ({ player, crown }) => {
  return (
    <tr
      style={{ color: player.game_paint_point === 0 ? 'lightgrey' : undefined }}
    >
      <td>
        {player.game_paint_point === 0 ? (
          <strike>{player.player.nickname}</strike>
        ) : (
          player.player.nickname
        )}
      </td>

      {player.player.udemae ? (
        <td>{`${player.player.udemae.name}${crown ? '👑' : ''}`}</td>
      ) : null}
      <td style={{ textAlign: 'center', background: 'darkgrey' }}>
        <Image
          src={`https://app.splatoon2.nintendo.net${player.player.weapon.thumbnail}`}
          style={{ maxHeight: 30 }}
          alt={player.player.weapon.name}
        />
      </td>
      <td>{player.game_paint_point}</td>
      <td>
        {`${player.kill_count + player.assist_count} (${player.assist_count})`}
      </td>
      <td>{`${player.kill_count} / ${player.death_count}`}</td>
      <td>{player.special_count}</td>
    </tr>
  );
};

const TeamStatTable = ({ result, team }) => {
  const total_k = team.reduce((sum, player) => sum + player.kill_count, 0);
  const total_a = team.reduce((sum, player) => sum + player.assist_count, 0);
  const total_d = team.reduce((sum, player) => sum + player.death_count, 0);
  const total_s = team.reduce((sum, player) => sum + player.special_count, 0);

  return (
    <Table striped bordered condensed hover>
      <TeamHeader player={team[0]} />
      <tbody>
        {team.map((player) => (
          <PlayerRow
            key={player.player.principal_id}
            player={player}
            crown={
              result.crown_players
                ? result.crown_players.includes(player.player.principal_id)
                : false
            }
          />
        ))}
      </tbody>
      <tfoot>
        <tr>
          <th>
            <FormattedMessage
              id="resultDetails.teamStats.header.totals"
              defaultMessage="Totals"
            />
          </th>
          <th />
          {team[0].player.udemae ? <th /> : null}
          <td>
            {team.reduce((sum, player) => sum + player.game_paint_point, 0)}
          </td>
          <td>{`${total_k + total_a} (${total_a})`}</td>
          <td>{`${total_k} / ${total_d}`}</td>
          <td>{`${total_s}`}</td>
        </tr>
      </tfoot>
    </Table>
  );
};

export default TeamStatTable;
