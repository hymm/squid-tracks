import React from 'react';
import { Panel } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';

const PlayerCard = ({ records }) => {
  console.log(records);
  const { player = {} } = records;
  const {
    udemae_rainmaker = {},
    udemae_tower = {},
    udemae_zones = {},
    udemae_clam = {}
  } = player;

  const sz_s_plus_number = udemae_zones.s_plus_number
    ? udemae_zones.s_plus_number
    : udemae_zones.number >= 10 && udemae_zones.number !== 128
      ? 0
      : '';
  const tc_s_plus_number = udemae_tower.s_plus_number
    ? udemae_tower.s_plus_number
    : udemae_tower.number >= 10 && udemae_tower.number !== 128
      ? 0
      : '';
  const rm_s_plus_number = udemae_rainmaker.s_plus_number
    ? udemae_rainmaker.s_plus_number
    : udemae_rainmaker.number >= 10 && udemae_rainmaker.number !== 128
      ? 0
      : '';
  const cb_s_plus_number = udemae_clam.s_plus_number
    ? udemae_clam.s_plus_number
    : udemae_clam.number >= 10 && udemae_clam.number !== 128
      ? 0
      : '';

  return (
    <Panel>
      <Panel.Heading>Player Card</Panel.Heading>
      <Panel.Body>
        <FormattedMessage
          id="PlayerCard.nickname"
          defaultMessage="Nickname: {nickname}"
          values={{ nickname: player.nickname }}
        />
        <br />
        <FormattedMessage
          id="PlayerCard.level"
          defaultMessage="Level: {rank}{star}"
          values={{
            star: player.star_rank > 0 ? `★${player.star_rank}` : '',
            rank: player.player_rank
          }}
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
          defaultMessage="TC: {name}{number}"
          values={{ name: udemae_tower.name, number: tc_s_plus_number }}
        />
        <br />
        <FormattedMessage
          id="PlayerCard.rainmakerShortname"
          defaultMessage="RM: {name}{number}"
          values={{ name: udemae_rainmaker.name, number: rm_s_plus_number }}
        />
        <br />
        <FormattedMessage
          id="PlayerCard.clamBlitzShortname"
          defaultMessage="CB: {name}{number}"
          values={{ name: udemae_clam.name, number: cb_s_plus_number }}
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
        <br />
        <FormattedMessage
          id="PlayerCard.winPercentage"
          defaultMessage="Win %: {count}"
          values={{
            count: (
              records.win_count /
              (records.lose_count + records.win_count)
            ).toFixed(2)
          }}
        />
      </Panel.Body>
    </Panel>
  );
};

export default PlayerCard;
