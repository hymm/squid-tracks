import React from 'react';
import { Panel } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';

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
      <FormattedMessage
        id="PlayerCard.nickname"
        defaultMessage="Nickname: {nickname}"
        values={{ nickname: player.nickname }}
      />
      <br />
      <FormattedMessage
        id="PlayerCard.splatzonesShortname"
        defaultMessage="SZ: {name}{number}"
        values={{ name: udemae_zones.name, number: sz_s_plus_number }}
      />
      <br />
      <FormattedMessage
        id="PlayerCard.towercontrolShortname"
        defaultMessage="SZ: {name}{number}"
        values={{ name: udemae_tower.name, number: tc_s_plus_number }}
      />
      <br />
      <FormattedMessage
        id="PlayerCard.rainmakerShortname"
        defaultMessage="SZ: {name}{number}"
        values={{ name: udemae_rainmaker.name, number: rm_s_plus_number }}
      />
      <br />
      <FormattedMessage
        id="PlayerCard.winCount"
        defaultMessage="Wins: {count}"
        values={{ count: records.win_count }}
      />
      <br />
      <FormattedMessage
        id="PlayerCard.loseCount"
        defaultMessage="Losses: {count}"
        values={{ count: records.lose_count }}
      />
    </Panel>
  );
};

export default PlayerCard;
