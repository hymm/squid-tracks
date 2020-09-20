import React from 'react';
import { Row, Col, ProgressBar, Badge } from 'react-bootstrap';
import { FormattedMessage, FormattedDate, FormattedTime } from 'react-intl';
import LobbyColors from './lobby-colors';

const BadgeStyle = {
  fontSize: 16,
  fontWeight: 'normal',
  color: 'white',
  marginRight: 5,
  float: 'left',
  marginBottom: 5,
  padding: '.35em .6em .35em',
};

const LeagueBadges = ({ result, colorMap }) => {
  return (
    <React.Fragment>
      {result.league_point != null ? (
        <Badge style={{ background: colorMap.normal, ...BadgeStyle }}>
          <FormattedMessage
            id="resultDetails.summary.currentPower"
            defaultMessage="Current Power {power}"
            values={{ power: result.league_point }}
          />
        </Badge>
      ) : null}
      {result.max_league_point != null && result.max_league_point > 0 ? (
        <Badge style={{ background: colorMap.dark, ...BadgeStyle }}>
          <FormattedMessage
            id="resultDetails.summary.maxPower"
            defaultMessage="Max Power {power}"
            values={{ power: result.max_league_point }}
          />
        </Badge>
      ) : null}
    </React.Fragment>
  );
};

const XRankBadges = ({ result, colorMap }) => {
  return (
    <React.Fragment>
      {result.x_power != null ? (
        <Badge variant="secondary" style={{ ...BadgeStyle }}>
          <FormattedMessage
            id="resultDetails.summary.xPower"
            defaultMessage="X Power {power}"
            values={{ power: result.x_power }}
          />
        </Badge>
      ) : null}
      {result.rank != null ? (
        <Badge variant="secondary" style={{ ...BadgeStyle }}>
          <FormattedMessage
            id="resultDetails.summary.globalRank"
            defaultMessage="Global Rank {rank}"
            values={{ rank: result.rank }}
          />
        </Badge>
      ) : null}
      {result.estimate_x_power != null ? (
        <Badge variant="secondary" style={{ ...BadgeStyle }}>
          <FormattedMessage
            id="resultDetails.summary.estimatePower.v2"
            defaultMessage="8-Squid Power {power}"
            values={{ power: result.estimate_x_power }}
          />
        </Badge>
      ) : null}
    </React.Fragment>
  );
};

const splatfestExp = [
  10, // Fan
  35, // Fiend
  50,
  85, // Defender
  184, // Champion
  // 184, // King/Queen
];

const FestivalBadges = ({ result, colorMap }) => {
  const expRequired =
    result.fes_grade != null ? splatfestExp[result.fes_grade.rank] : null;
  return (
    <React.Fragment>
      {result.fes_power ? (
        <Badge style={{ background: colorMap.normal, ...BadgeStyle }}>
          <FormattedMessage
            id="resultDetails.summary.currentPower"
            defaultMessage="Current Power {power}"
            values={{ power: result.fes_power }}
          />
        </Badge>
      ) : null}
      {result.max_fes_poser != null ? (
        <Badge style={{ background: colorMap.normal, ...BadgeStyle }}>
          <FormattedMessage
            id="resultDetails.summary.maxPower"
            defaultMessage="Max Power {power}"
            values={{ power: result.max_fes_poser }}
          />
        </Badge>
      ) : null}
      {result.fes_grade != null ? (
        <Badge style={{ background: colorMap.normal, ...BadgeStyle }}>
          {result.fes_grade.name}
        </Badge>
      ) : null}
      {result.fes_point != null && expRequired != null ? (
        <Badge style={{ background: colorMap.normal, ...BadgeStyle }}>
          {`${result.fes_point}/${expRequired}`}
        </Badge>
      ) : null}
    </React.Fragment>
  );
};

const RankedBadges = ({ result, colorMap }) => {
  return (
    <React.Fragment>
      {result.estimate_gachi_power != null ? (
        <Badge variant="secondary" style={{ ...BadgeStyle }}>
          <FormattedMessage
            id="resultDetails.summary.estimatePower.v2"
            defaultMessage="8-Squid Power {power}"
            values={{ power: result.estimate_gachi_power }}
          />
        </Badge>
      ) : null}
    </React.Fragment>
  );
};

const TurfBadges = ({ result, colorMap }) => {
  return (
    <React.Fragment>
      {result.win_meter != null ? (
        <Badge variant="secondary" style={{ ...BadgeStyle }}>
          <FormattedMessage
            id="resultDetails.summary.winMeter"
            defaultMessage="Win Meter {meter}"
            values={{ meter: result.win_meter }}
          />
        </Badge>
      ) : null}
    </React.Fragment>
  );
};

const BattleBadges = ({ result }) => {
  const lobby = result.game_mode.key;
  const colorMap = LobbyColors[lobby];

  return (
    <React.Fragment>
      <Badge
        variant={result.my_team_result.key === 'victory' ? 'info' : 'warning'}
        style={BadgeStyle}
      >
        <FormattedMessage
          id="resultDetails.summary.resultInElapsedTime"
          defaultMessage="{result} in {time} sec"
          values={{
            result: result.my_team_result.name,
            time: result.elapsed_time,
          }}
        />
      </Badge>
      <Badge style={{ background: colorMap.normal, ...BadgeStyle }}>
        {`${result.game_mode.name}`}
      </Badge>

      <LeagueBadges result={result} colorMap={colorMap} />
      <XRankBadges result={result} colorMap={colorMap} />
      <FestivalBadges result={result} colorMap={colorMap} />
      <RankedBadges result={result} colorMap={colorMap} />
      <TurfBadges result={result} colorMap={colorMap} />
    </React.Fragment>
  );
};

const BattleSummary = ({ result }) => {
  const myScore =
    result.my_team_count == null
      ? result.my_team_percentage
      : result.my_team_count;
  const otherScore =
    result.other_team_count == null
      ? result.other_team_percentage
      : result.other_team_count;
  const totalScore = myScore + otherScore;
  const myNow = (myScore * 100) / totalScore;
  const otherNow = (otherScore * 100) / totalScore;
  return (
    <>
      <Row>
        <Col md={12}>
          <h2 style={{ marginTop: 0 }}>
            <FormattedMessage
              id="resultDetails.summary.title"
              defaultMessage="{rule} on {map}"
              values={{
                rule: result.rule.name,
                map: result.stage.name,
              }}
            />
          </h2>
        </Col>
      </Row>
      <Row>
        <Col md={12} style={{ marginTop: -8, marginBottom: 10 }}>
          <FormattedDate
            value={new Date(result.start_time * 1000)}
            year="numeric"
            month="long"
            day="2-digit"
          />{' '}
          <FormattedTime value={new Date(result.start_time * 1000)} />
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <BattleBadges result={result} />
        </Col>
      </Row>
      <Row className="mb-3">
        <Col md={12}>
          <ProgressBar style={{ height: 30 }}>
            <ProgressBar
              striped
              now={myNow}
              variant="info"
              label={myScore}
              key={1}
              style={{ fontSize: 16, padding: '.35em 0' }}
            />
            <ProgressBar
              striped
              now={otherNow}
              variant="warning"
              label={otherScore}
              key={2}
              style={{ fontSize: 16, padding: '.35em 0' }}
            />
          </ProgressBar>
        </Col>
      </Row>
    </>
  );
};

export default BattleSummary;
