import React, { useEffect } from 'react';
import { Grid, Row, Col, Table, Image } from 'react-bootstrap';
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
    <tr>
      <td>{hour}</td>
      <td>
        <Grid fluid>
          <Row>
            <Col md={12}>
              <strong>{rotation.rule.name}</strong>
            </Col>
          </Row>
          <Row>
            <Col md={6} style={{ minWidth: 111, maxWidth: 360, padding: 0 }}>
              <div className="rotation-map">
                <Image
                  src={
                    'https://app.splatoon2.nintendo.net' +
                    rotation.stage_a.image
                  }
                  responsive
                />
                {rotation.stage_a.name}
              </div>
            </Col>
            <Col md={6} style={{ minWidth: 111, maxWidth: 360, padding: 0 }}>
              <div className="rotation-map">
                <Image
                  src={
                    'https://app.splatoon2.nintendo.net' +
                    rotation.stage_b.image
                  }
                  responsive
                />
                {rotation.stage_b.name}
              </div>
            </Col>
          </Row>
        </Grid>
      </td>
    </tr>
  );
};

export default function Schedule() {
  const splatnet = useSplatnet();
  useEffect(splatnet.comm.updateSchedule, [splatnet]);
  const { regular = [], gachi = [], league = [] } = splatnet.current.schedule;
  return (
    <Grid fluid style={{ paddingTop: 65 }}>
      <Row>
        <Col md={4}>
          <h2>
            <FormattedMessage id="schedule.regular" defaultMessage="Turf" />
          </h2>
          <Table>
            <tbody>
              {regular.map((rotation) => (
                <GachiRow key={rotation.start_time} rotation={rotation} />
              ))}
            </tbody>
          </Table>
        </Col>
        <Col md={4}>
          <h2>
            <FormattedMessage id="schedule.gachi" defaultMessage="Ranked" />
          </h2>
          <Table>
            <tbody>
              {gachi.map((rotation) => (
                <GachiRow key={rotation.start_time} rotation={rotation} />
              ))}
            </tbody>
          </Table>
        </Col>
        <Col md={4}>
          <h2>
            <FormattedMessage id="schedule.league" defaultMessage="League" />
          </h2>
          <Table>
            <tbody>
              {league.map((rotation) => (
                <GachiRow key={rotation.start_time} rotation={rotation} />
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Grid>
  );
}
