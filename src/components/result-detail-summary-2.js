import React from 'react';
import { Row, Col, ProgressBar, Label } from 'react-bootstrap';
import LobbyColors from './lobby-colors';

const labelStyle = {
  fontSize: 16,
  fontWeight: 'normal',
  marginRight: 5,
  float: 'left',
  marginBottom: 5,
  padding: '.35em .6em .35em',
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
            {`${result.rule.name} on ${result.stage.name}`}
          </h2>
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
            {`${result.my_team_result.name} in ${result.elapsed_time} sec`}
          </Label>
          <Label style={{ background: colorMap.normal, ...labelStyle }}>
            {`${result.game_mode.name}`}
          </Label>
          {result.max_league_point != null && result.max_league_point > 0 ? (
            <Label style={{ background: colorMap.dark, ...labelStyle }}>
              {`Max Power ${result.max_league_point}`}
            </Label>
          ) : null}
          {result.league_point != null ? (
            <Label style={{ background: colorMap.normal, ...labelStyle }}>
              {`Current Power ${result.league_point}`}
            </Label>
          ) : null}
          {result.estimate_gachi_power != null ? (
            <Label bsStyle="default" style={{ ...labelStyle }}>
              {`Estimate Power ${result.estimate_gachi_power}`}
            </Label>
          ) : null}
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
              style={{ fontSize: 16, padding: '.35em 0', }}
            />
            <ProgressBar
              striped
              now={otherNow}
              bsStyle="warning"
              label={otherScore}
              key={2}
              style={{ fontSize: 16, padding: '.35em 0', }}
            />
          </ProgressBar>
        </Col>
      </Row>
    </div>
  );
};

export default BattleSummary;
