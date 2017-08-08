import React from 'react';
import { Grid, Row, Col, ButtonToolbar, Button } from 'react-bootstrap';
import StageCard from './components/stage-card';
import PlayerCard from './components/player-card';
import WeaponCard from './components/weapon-card';
const { ipcRenderer } = window.require('electron');

const Records = () =>
  <Grid fluid>
    <Row>
      <Col md={12}>
        <ResultsContainer />
      </Col>
    </Row>
  </Grid>;

class ResultsContainer extends React.Component {
  state = {
    records: {
      records: {}
    }
  };

  componentDidMount() {
    this.getRecords();
  }

  getRecords() {
    const records = ipcRenderer.sendSync('getApi', 'records');
    this.setState({ records: records });
  }

  render() {
    return (
      <div>
        <ButtonToolbar style={{ marginBottom: '10px' }}>
          <Button onClick={() => this.getRecords()}>Refresh</Button>
        </ButtonToolbar>
        <PlayerCard records={this.state.records.records} />
        <StageCard records={this.state.records.records} />
        <WeaponCard records={this.state.records.records} />
      </div>
    );
  }
}

export default Records;
