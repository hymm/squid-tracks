import React from 'react';
import { Subscriber } from 'react-broadcast';
import { FormattedDate, FormattedTime } from 'react-intl';
import { Grid, Row, Col, Image, Panel } from 'react-bootstrap';

const SalmonDetail = ({ detail }) => {
  return (
    <Panel>
      <Panel.Heading>
        <FormattedDate
          value={new Date(detail.start_time * 1000)}
          month="numeric"
          day="2-digit"
        />{' '}
        <FormattedTime value={new Date(detail.start_time * 1000)} />
        {' - '}
        <FormattedDate
          value={new Date(detail.end_time * 1000)}
          month="numeric"
          day="2-digit"
        />{' '}
        <FormattedTime value={new Date(detail.end_time * 1000)} />
      </Panel.Heading>
      <Panel.Body>
        <h4 style={{ marginTop: 0 }}>{detail.stage.name}</h4>
        <Image
          src={`https://app.splatoon2.nintendo.net${detail.stage.image}`}
          style={{ maxHeight: 100, marginBottom: 10 }}
          alt={detail.stage.name}
        />
        <br />
        {detail.weapons.map(weapon => (
          <Image
            src={`https://app.splatoon2.nintendo.net${weapon.thumbnail}`}
            style={{ maxHeight: 40 }}
            alt={weapon.name}
          />
        ))}
      </Panel.Body>
    </Panel>
  );
};

class Salmon extends React.Component {
  componentDidMount() {
    this.props.splatnet.comm.updateCoop();
  }

  render() {
    const { splatnet } = this.props;
    const { coop_schedules } = splatnet.current;
    return (
      <Grid fluid style={{ paddingTop: 65 }}>
        <Row>
          <Col md={4}>
            <h1>Shift Schedule</h1>
            {coop_schedules.details.map(d => <SalmonDetail detail={d} />)}
          </Col>
        </Row>
      </Grid>
    );
  }
}

const SalmonWithSplatnet = () => {
  return (
    <Subscriber channel="splatnet">
      {splatnet => <Salmon splatnet={splatnet} />}
    </Subscriber>
  );
};

export default SalmonWithSplatnet;
