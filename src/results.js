import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import ResultsSummaryCard from './components/results-summary-card';
import ResultsCard from './components/results-card';
import ResultDetailCard from './components/result-detail-card';
import ResultsControl from './components/results-controls';
const { ipcRenderer } = require('electron');

const Results = () =>
  <Grid fluid style={{ marginTop: 65 }}>
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
    currentResult: {},
    currentResultIndex: 0,
    statInk: {}
  };

  componentDidMount() {
    this.getResults();
    const statInkInfo = ipcRenderer.sendSync('getFromStatInkStore', 'info');
    this.setState({ statInk: statInkInfo });
  }

  getResults = () => {
    const results = ipcRenderer.sendSync('getApi', 'results');
    this.setState({ results: results });
    this.changeResult(0, results.results);
    this.setState({ initialized: true });
  };

  changeResult = (arrayIndex, results) => {
    const resultsPicked = results ? results : this.state.results.results;
    const battleNumber = resultsPicked[arrayIndex].battle_number;
    this.setState({
      currentResult: ipcRenderer.sendSync('getApi', `results/${battleNumber}`),
      currentResultIndex: arrayIndex
    });
  };

  changeResultByBattleNumber = battleNumber => {
    this.setState({
      currentResult: ipcRenderer.sendSync('getApi', `results/${battleNumber}`),
      currentResultIndex: this.state.results.results.findIndex(
        a => a.battle_number === battleNumber
      )
    });
  };

  setStatInkInfo = (battleNumber, info) => {
    const statInk = this.state.statInk;
    statInk[battleNumber] = info;
    this.setState({ statInk: statInk });
    ipcRenderer.sendSync('setToStatInkStore', 'info', statInk);
  };

  render() {
    const { results, currentResult, statInk, currentResultIndex } = this.state;
    return (
      <div>
        <ResultsControl
          result={currentResult}
          resultIndex={currentResultIndex}
          results={results.results}
          changeResult={this.changeResult}
          getResults={this.getResults}
          setStatInkInfo={this.setStatInkInfo}
          statInk={statInk}
        />
        {this.state.initialized
          ? <ResultDetailCard result={currentResult} statInk={statInk} />
          : null}
        <ResultsSummaryCard summary={results.summary} />
        <ResultsCard
          results={results.results}
          statInk={statInk}
          changeResult={this.changeResultByBattleNumber}
        />
      </div>
    );
  }
}

export default Results;
