import React from 'react';
import { Table, Image } from 'react-bootstrap';

const TeamHeader = ({ player = { player: {} } }) =>
  <thead>
    <tr>
      <th>Player</th>
      <th />
      <th colSpan="2">Head</th>
      <th colSpan="2">Clothes</th>
      <th colSpan="2">Shoes</th>
    </tr>
  </thead>;

const GearCell = ({ gear }) => {
  const mainHeight = 30;
  return (
    <td style={{ textAlign: 'center', background: 'darkgrey' }}>
      <Image
        rounded
        src={`https://app.splatoon2.nintendo.net${gear.thumbnail}`}
        style={{ maxHeight: mainHeight }}
        alt={gear.name}
      />
    </td>
  );
};

const AbilityCell = ({ skills }) => {
  const mainHeight = 30;
  const subHeight = 20;
  const background = '#777';

  return (
    <td style={{ textAlign: 'left', background: 'darkgrey' }}>
      <Image
        circle
        src={`https://app.splatoon2.nintendo.net${skills.main.image}`}
        style={{ maxHeight: mainHeight, background }}
        alt={skills.main.name}
      />
      {skills.subs.map(
        skill =>
          skill
            ? <Image
                circle
                src={`https://app.splatoon2.nintendo.net${skill.image}`}
                style={{ maxHeight: subHeight, background }}
                alt={skill.name}
              />
            : null
      )}
    </td>
  );
};

const PlayerRow = ({ player }) => {
  return (
    <tr>
      <td>
        {player.player.nickname}
      </td>
      <td style={{ textAlign: 'center', background: 'darkgrey' }}>
        <Image
          src={`https://app.splatoon2.nintendo.net${player.player.weapon
            .thumbnail}`}
          style={{ maxHeight: 30 }}
          alt={player.player.weapon.name}
        />
      </td>
      <GearCell gear={player.player.head} />
      <AbilityCell skills={player.player.head_skills} />
      <GearCell gear={player.player.clothes} />
      <AbilityCell skills={player.player.clothes_skills} />
      <GearCell gear={player.player.shoes} />
      <AbilityCell skills={player.player.shoes_skills} />
    </tr>
  );
};

const TeamStatTable = ({ result, team }) => {
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

export default TeamStatTable;
