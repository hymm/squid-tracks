import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
const remote = window.require('electron').remote;
const { getApi } = remote.require('./main.js');

const Results = () =>
  <Grid fluid>
    <Row>
      <Col md={12}>
        <ResultsContainer />
      </Col>
    </Row>
  </Grid>;

class ResultsContainer extends React.Component {
  state = {
    results: {
      records: {}
    }
  };

  componentDidMount() {
    this.getRecords();
  }

  async getRecords() {
    const records = await getApi('records');
    this.setState({ records: records });
  }

  render() {
    return <div />;
  }
}

export default Results;
