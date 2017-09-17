import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import ResultsSummaryCard from './components/results-summary-card-2';
import ResultsCard from './components/results-card';
import ResultDetailCard from './components/result-detail-card';
import ResultsControl from './components/results-controls';
import { ipcRenderer } from 'electron';
import { Subscriber } from 'react-broadcast';

class Results extends React.Component {
  state = {
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
    const { splatnet } = this.props;
    const results = splatnet.comm.updateResults();
    this.changeResult(0, results.results);
    this.setState({ initialized: true });
  };

  changeResult = (arrayIndex, results) => {
    const { splatnet } = this.props;
    const resultsPicked = results ? results : splatnet.current.results.results;
    const battleNumber = resultsPicked[arrayIndex].battle_number;
    this.setState({
      currentResult: splatnet.comm.getBattle(battleNumber),
      currentResultIndex: arrayIndex
    });
  };

  changeResultByBattleNumber = battleNumber => {
    const { splatnet } = this.props;
    this.setState({
      currentResult: splatnet.comm.getBattle(battleNumber),
      currentResultIndex: splatnet.current.results.results.findIndex(
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
    const { currentResult, statInk, currentResultIndex } = this.state;
    const results = this.props.splatnet.current.results;
    return (
      <Grid fluid style={{ marginTop: 65 }}>
        <Row>
          <Col md={12}>
            <ResultsControl
              result={currentResult}
              resultIndex={currentResultIndex}
              results={results.results}
              changeResult={this.changeResult}
              getResults={this.getResults}
              setStatInkInfo={this.setStatInkInfo}
              statInk={statInk}
            />
            {this.state.initialized ? (
              <ResultDetailCard result={currentResult} statInk={statInk} />
            ) : null}
            <ResultsCard
              results={results.results}
              statInk={statInk}
              changeResult={this.changeResultByBattleNumber}
              summary={results.summary}
            />
          </Col>
        </Row>
      </Grid>
    );
  }
}

const SubscribedResults = () => {
  return (
    <Subscriber channel="splatnet">
      {splatnet => <Results splatnet={splatnet} />}
    </Subscriber>
  );
};

export default SubscribedResults;
