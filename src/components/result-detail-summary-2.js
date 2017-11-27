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
  padding: '.35em .6em .35em'
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
  const myNow = myScore * 100 / totalScore;
  const otherNow = otherScore * 100 / totalScore;
  const lobby = result.game_mode.key;
  const colorMap = LobbyColors[lobby];
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
                map: result.stage.name
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
          <Label
            bsStyle={
              result.my_team_result.key === 'victory' ? 'info' : 'warning'
            }
            style={labelStyle}
          >
            <FormattedMessage
              id="resultDetails.summary.resultInElapsedTime"
              defaultMessage="{result} in {time} sec"
              values={{
                result: result.my_team_result.name,
                time: result.elapsed_time
              }}
            />
          </Label>
          <Label style={{ background: colorMap.normal, ...labelStyle }}>
            {`${result.game_mode.name}`}
          </Label>
          {result.league_point != null
            ? <Label style={{ background: colorMap.normal, ...labelStyle }}>
                <FormattedMessage
                  id="resultDetails.summary.currentPower"
                  defaultMessage="Current Power {power}"
                  values={{ power: result.league_point }}
                />
              </Label>
            : null}
          {result.max_league_point != null && result.max_league_point > 0
            ? <Label style={{ background: colorMap.dark, ...labelStyle }}>
                <FormattedMessage
                  id="resultDetails.summary.maxPower"
                  defaultMessage="Max Power {power}"
                  values={{ power: result.max_league_point }}
                />
              </Label>
            : null}
          {result.fes_power
            ? <Label style={{ background: colorMap.normal, ...labelStyle }}>
                <FormattedMessage
                  id="resultDetails.summary.currentPower"
                  defaultMessage="Current Power {power}"
                  values={{ power: result.fes_power }}
                />
              </Label>
            : null}
          {result.max_fes_poser != null
            ? <Label style={{ background: colorMap.normal, ...labelStyle }}>
                <FormattedMessage
                  id="resultDetails.summary.maxPower"
                  defaultMessage="Max Power {power}"
                  values={{ power: result.max_fes_poser }}
                />
              </Label>
            : null}
          {result.estimate_gachi_power != null
            ? <Label bsStyle="default" style={{ ...labelStyle }}>
                <FormattedMessage
                  id="resultDetails.summary.estimatePower"
                  defaultMessage="Estimate Power {power}"
                  values={{ power: result.estimate_gachi_power }}
                />
              </Label>
            : null}
          {result.win_meter != null
            ? <Label bsStyle="default" style={{ ...labelStyle }}>
                <FormattedMessage
                  id="resultDetails.summary.winMeter"
                  defaultMessage="Win Meter {meter}"
                  values={{ meter: result.win_meter }}
                />
              </Label>
            : null}
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
