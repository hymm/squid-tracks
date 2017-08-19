import React from 'react';
import { Grid, Row, Col, Table, Image } from 'react-bootstrap';
import './schedule.css';
const { ipcRenderer } = window.require('electron');

const GachiRow = ({ rotation }) => {
  const now = Date.now() / 1000;
  let hour = 0;
  if (now > rotation.start_time && now < rotation.end_time) {
    hour = 'current';
  } else {
    hour = new Date(rotation.start_time * 1000).getHours();
  }
  return (
    <tr>
      <td>
        {hour}
      </td>
      <td>
        <Grid fluid>
          <Row>
            <Col md={12}>
              <strong>
                {rotation.rule.name}
              </strong>
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

export default class ScheduleContainer extends React.Component {
  state = {
    schedules: { gachi: [], league: [], regular: [] }
  };
  componentDidMount() {
    this.getSchedule();
  }

  getSchedule() {
    const schedules = ipcRenderer.sendSync('getApi', 'schedules');
    this.setState({ schedules: schedules });
  }

  render() {
    return (
      <Grid fluid style={{ paddingTop: 65 }}>
        <Row>
          <Col md={4}>
            <h2>Ranked</h2>
            <Table>
              <tbody>
                {this.state.schedules.gachi.map(rotation =>
                  <GachiRow key={rotation.start_time} rotation={rotation} />
                )}
              </tbody>
            </Table>
          </Col>
          <Col md={4}>
            <h2>League</h2>
            <Table>
              <tbody>
                {this.state.schedules.league.map(rotation =>
                  <GachiRow key={rotation.start_time} rotation={rotation} />
                )}
              </tbody>
            </Table>
          </Col>
          <Col md={4}>
            <h2>Turf</h2>
            <Table>
              <tbody>
                {this.state.schedules.regular.map(rotation =>
                  <GachiRow key={rotation.start_time} rotation={rotation} />
                )}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Grid>
    );
  }
}
