import React from 'react';
import { Grid, Row, Col, ButtonToolbar, Button } from 'react-bootstrap';
import ResultsSummaryCard from './components/results-summary-card';
import ResultsCard from './components/results-card';
import ResultDetailCard from './components/result-detail-card';
const { ipcRenderer } = window.require('electron');

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
    currentResult: {}
  };

  componentDidMount() {
    this.getResults();
  }

  getResults = () => {
    const results = ipcRenderer.sendSync('getApi', 'results');
    this.setState({ results: results });
    this.changeResult(results.results[0].battle_number);
    this.setState({ initialized: true });
  };

  changeResult = battleNumber => {
    this.setState({
      currentResult: ipcRenderer.sendSync('getApi', `results/${battleNumber}`)
    });
  };

  render() {
    return (
      <div>
        <ButtonToolbar style={{ marginBottom: '10px' }}>
          <Button onClick={() => this.getResults()}>Refresh</Button>
        </ButtonToolbar>
        <ResultsSummaryCard summary={this.state.results.summary} />
        {this.state.initialized
          ? <ResultDetailCard
              result={this.state.currentResult}
              changeResult={this.changeResult}
              latestBattleNumber={this.state.results.results[0].battle_number}
              getResults={this.getResults}
            />
          : null}
        <ResultsCard
          results={this.state.results.results}
          changeResult={this.changeResult}
        />
      </div>
    );
  }
}

export default Results;
