import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import ResultsSummaryCard from './components/results-summary-card';
import ResultsCard from './components/results-card';
import ResultDetailCard from './components/result-detail-card';
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
      summary: {},
      results: []
    },
    recent: {}
  };

  componentDidMount() {
    this.getRecords();
  }

  async getRecords() {
    const results = await getApi('results');
    this.setState({ results: results });
    this.setState({
      recent: await getApi(`results/${results.results[0].battle_number}`)
    });
    this.setState({ initialized: true });
  }

  render() {
    return (
      <div>
        <ResultsSummaryCard summary={this.state.results.summary} />
        {this.state.initialized
          ? <ResultDetailCard result={this.state.recent} />
          : null}
        <ResultsCard results={this.state.results.results} />
      </div>
    );
  }
}

export default Results;
