import React, { useEffect } from 'react';
import { Container, Row, Col, Table, Image } from 'react-bootstrap';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';
import { useSplatnet } from './splatnet-provider';
import './schedule.css';

const messages = defineMessages({
  current: {
    id: 'Schedule.currentRotation',
    defaultMessage: 'current',
  },
});

const GachiRow = ({ rotation }) => {
  const intl = useIntl();
  const now = Date.now() / 1000;
  let hour = 0;
  if (now > rotation.start_time && now < rotation.end_time) {
    hour = intl.formatMessage(messages.current);
  } else {
    hour = new Date(rotation.start_time * 1000).getHours();
  }

  return (
    <Container>
      <Row>{hour}</Row>
      <Row>
        <Col>
          <strong>{rotation.rule.name}</strong>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="rotation-map">
            <Image
              src={
                'https://app.splatoon2.nintendo.net' + rotation.stage_a.image
              }
              fluid
            />
            {rotation.stage_a.name}
          </div>
        </Col>
        <Col>
          <div className="rotation-map">
            <Image
              src={
                'https://app.splatoon2.nintendo.net' + rotation.stage_b.image
              }
              fluid
            />
            {rotation.stage_b.name}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default function Schedule() {
  const splatnet = useSplatnet();
  useEffect(splatnet.comm.updateSchedule, []);
  const { regular = [], gachi = [], league = [] } = splatnet.current.schedule;
  return (
    <Container style={{ paddingTop: '1rem' }}>
      <Row>
        <Col md={4}>
          <h2>
            <FormattedMessage id="schedule.regular" defaultMessage="Turf" />
          </h2>
          {regular.map((rotation) => (
            <GachiRow key={rotation.start_time} rotation={rotation} />
          ))}
        </Col>
        <Col md={4}>
          <h2>
            <FormattedMessage id="schedule.gachi" defaultMessage="Ranked" />
          </h2>
          {gachi.map((rotation) => (
            <GachiRow key={rotation.start_time} rotation={rotation} />
          ))}
        </Col>
        <Col md={4}>
          <h2>
            <FormattedMessage id="schedule.league" defaultMessage="League" />
          </h2>
          {league.map((rotation) => (
            <GachiRow key={rotation.start_time} rotation={rotation} />
          ))}
        </Col>
      </Row>
    </Container>
  );
}
