import React from 'react';
import { Grid, Row, Col, Table } from 'react-bootstrap';
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
        {rotation.rule.name}
      </td>
      <td>
        {`${rotation.stage_a.name}`}
        <br />
        {`${rotation.stage_b.name}`}
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
