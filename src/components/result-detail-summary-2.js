import React from 'react';
import { Row, Col, ProgressBar } from 'react-bootstrap';

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
          <ProgressBar>
            <ProgressBar
              striped
              now={myNow}
              bsStyle="info"
              label={myScore}
              key={1}
            />
            <ProgressBar
              striped
              now={otherNow}
              bsStyle="warning"
              label={otherScore}
              key={2}
            />
          </ProgressBar>
        </Col>
      </Row>
    </div>
  );
};

export default BattleSummary;
