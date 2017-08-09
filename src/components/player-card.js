import React from 'react';
import { Panel } from 'react-bootstrap';

const PlayerCard = ({ records }) => {
  const { player = {} } = records;
  const {
    udemae_rainmaker = {},
    udemae_tower = {},
    udemae_zones = {}
  } = player;

  const sz_s_plus_number = udemae_zones.s_plus_number
    ? udemae_zones.s_plus_number
    : udemae_zones.number >= 10 ? 0 : '';
  const tc_s_plus_number = udemae_tower.s_plus_number
    ? udemae_tower.s_plus_number
    : udemae_tower.number >= 10 ? 0 : '';
  const rm_s_plus_number = udemae_rainmaker.s_plus_number
    ? udemae_rainmaker.s_plus_number
    : udemae_rainmaker.number >= 10 ? 0 : '';

  return (
    <Panel header={<h3>Player Card</h3>}>
      <div>{`Nickname: ${player.nickname}`}</div>
      <div>{`SZ: ${udemae_zones.name}${sz_s_plus_number}`}</div>
      <div>{`TC: ${udemae_tower.name}${tc_s_plus_number}`}</div>
      <div>{`RM: ${udemae_rainmaker.name}${rm_s_plus_number}`}</div>
      <div>{`Wins: ${records.win_count}`}</div>
      <div>{`Losses: ${records.lose_count}`}</div>
    </Panel>
  );
};

export default PlayerCard;
