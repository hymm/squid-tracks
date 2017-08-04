import React from 'react';
import { Panel } from 'react-bootstrap';

const PlayerCard = ({ records }) =>
  <Panel header={<h3>Player Card</h3>}>
    <div>{`Nickname: ${records.player.nickname}`}</div>
    <div>{`RM: ${records.player.udemae_rainmaker.name} ${records.player
      .udemae_rainmaker.s_plus_number}`}</div>
    <div>{`TC: ${records.player.udemae_tower.name} ${records.player.udemae_tower
      .s_plus_number}`}</div>
    <div>{`SZ: ${records.player.udemae_zones.name} ${records.player.udemae_zones
      .s_plus_number}`}</div>
    <div>{`Wins: ${records.win_count}`}</div>
    <div>{`Losses: ${records.lose_count}`}</div>
  </Panel>;

export default PlayerCard;
