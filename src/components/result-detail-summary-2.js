import React from 'react';
import { Row, Col, ProgressBar, Label } from 'react-bootstrap';
import { FormattedMessage, FormattedDate, FormattedTime } from 'react-intl';
import LobbyColors from './lobby-colors';

const labelStyle = {
  fontSize: 16,
  fontWeight: 'normal',
  marginRight: 5,
  float: 'left',
  marginBottom: 5,
  padding: '.35em .6em .35em',
};

const LeagueLabels = ({ result, colorMap }) => {
  return (
    <React.Fragment>
      {result.league_point != null ? (
        <Label style={{ background: colorMap.normal, ...labelStyle }}>
          <FormattedMessage
            id="resultDetails.summary.currentPower"
            defaultMessage="Current Power {power}"
            values={{ power: result.league_point }}
          />
        </Label>
      ) : null}
      {result.max_league_point != null && result.max_league_point > 0 ? (
        <Label style={{ background: colorMap.dark, ...labelStyle }}>
          <FormattedMessage
            id="resultDetails.summary.maxPower"
            defaultMessage="Max Power {power}"
            values={{ power: result.max_league_point }}
          />
        </Label>
      ) : null}
    </React.Fragment>
  );
};

const XRankLabels = ({ result, colorMap }) => {
  return (
    <React.Fragment>
      {result.x_power != null ? (
        <Label bsStyle="default" style={{ ...labelStyle }}>
          <FormattedMessage
            id="resultDetails.summary.xPower"
            defaultMessage="X Power {power}"
            values={{ power: result.x_power }}
          />
        </Label>
      ) : null}
      {result.rank != null ? (
        <Label bsStyle="default" style={{ ...labelStyle }}>
          <FormattedMessage
            id="resultDetails.summary.globalRank"
            defaultMessage="Global Rank {rank}"
            values={{ rank: result.rank }}
          />
        </Label>
      ) : null}
      {result.estimate_x_power != null ? (
        <Label bsStyle="default" style={{ ...labelStyle }}>
          <FormattedMessage
            id="resultDetails.summary.estimatePower.v2"
            defaultMessage="8-Squid Power {power}"
            values={{ power: result.estimate_x_power }}
          />
        </Label>
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

const FestivalLabels = ({ result, colorMap }) => {
  const expRequired =
    result.fes_grade != null ? splatfestExp[result.fes_grade.rank] : null;
  return (
    <React.Fragment>
      {result.fes_power ? (
        <Label style={{ background: colorMap.normal, ...labelStyle }}>
          <FormattedMessage
            id="resultDetails.summary.currentPower"
            defaultMessage="Current Power {power}"
            values={{ power: result.fes_power }}
          />
        </Label>
      ) : null}
      {result.max_fes_poser != null ? (
        <Label style={{ background: colorMap.normal, ...labelStyle }}>
          <FormattedMessage
            id="resultDetails.summary.maxPower"
            defaultMessage="Max Power {power}"
            values={{ power: result.max_fes_poser }}
          />
        </Label>
      ) : null}
      {result.fes_grade != null ? (
        <Label style={{ background: colorMap.normal, ...labelStyle }}>
          {result.fes_grade.name}
        </Label>
      ) : null}
      {result.fes_point != null && expRequired != null ? (
        <Label style={{ background: colorMap.normal, ...labelStyle }}>
          {`${result.fes_point}/${expRequired}`}
        </Label>
      ) : null}
    </React.Fragment>
  );
};

const RankedLabels = ({ result, colorMap }) => {
  return (
    <React.Fragment>
      {result.estimate_gachi_power != null ? (
        <Label bsStyle="default" style={{ ...labelStyle }}>
          <FormattedMessage
            id="resultDetails.summary.estimatePower.v2"
            defaultMessage="8-Squid Power {power}"
            values={{ power: result.estimate_gachi_power }}
          />
        </Label>
      ) : null}
    </React.Fragment>
  );
};

const TurfLabels = ({ result, colorMap }) => {
  return (
    <React.Fragment>
      {result.win_meter != null ? (
        <Label bsStyle="default" style={{ ...labelStyle }}>
          <FormattedMessage
            id="resultDetails.summary.winMeter"
            defaultMessage="Win Meter {meter}"
            values={{ meter: result.win_meter }}
          />
        </Label>
      ) : null}
    </React.Fragment>
  );
};

const BattleLabels = ({ result }) => {
  const lobby = result.game_mode.key;
  const colorMap = LobbyColors[lobby];

  return (
    <React.Fragment>
      <Label
        bsStyle={result.my_team_result.key === 'victory' ? 'info' : 'warning'}
        style={labelStyle}
      >
        <FormattedMessage
          id="resultDetails.summary.resultInElapsedTime"
          defaultMessage="{result} in {time} sec"
          values={{
            result: result.my_team_result.name,
            time: result.elapsed_time,
          }}
        />
      </Label>
      <Label style={{ background: colorMap.normal, ...labelStyle }}>
        {`${result.game_mode.name}`}
      </Label>

      <LeagueLabels result={result} colorMap={colorMap} />
      <XRankLabels result={result} colorMap={colorMap} />
      <FestivalLabels result={result} colorMap={colorMap} />
      <RankedLabels result={result} colorMap={colorMap} />
      <TurfLabels result={result} colorMap={colorMap} />
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
    <div>
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
          <BattleLabels result={result} />
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <ProgressBar style={{ height: 30 }}>
            <ProgressBar
              striped
              now={myNow}
              bsStyle="info"
              label={myScore}
              key={1}
              style={{ fontSize: 16, padding: '.35em 0' }}
            />
            <ProgressBar
              striped
              now={otherNow}
              bsStyle="warning"
              label={otherScore}
              key={2}
              style={{ fontSize: 16, padding: '.35em 0' }}
            />
          </ProgressBar>
        </Col>
      </Row>
    </div>
  );
};

export default BattleSummary;
