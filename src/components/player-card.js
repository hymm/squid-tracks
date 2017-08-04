import React from 'react';
import { Panel } from 'react-bootstrap';

const PlayerCard = ({ records }) => {
  const { player = {} } = records;
  const {
    udemae_rainmaker = {},
    udemae_tower = {},
    udemae_zones = {}
  } = player;
  return (
    <Panel header={<h3>Player Card</h3>}>
      <div>{`Nickname: ${player.nickname}`}</div>
      <div
      >{`RM: ${udemae_rainmaker.name} ${udemae_rainmaker.s_plus_number}`}</div>
      <div>{`TC: ${udemae_tower.name} ${udemae_tower.s_plus_number}`}</div>
      <div>{`SZ: ${udemae_zones.name} ${udemae_zones.s_plus_number}`}</div>
      <div>{`Wins: ${records.win_count}`}</div>
      <div>{`Losses: ${records.lose_count}`}</div>
    </Panel>
  );
};

export default PlayerCard;
