import React from 'react';
import {
  Grid,
  Row,
  Col,
  ButtonToolbar,
  ButtonGroup,
  Button,
  DropdownButton,
  MenuItem,
  Glyphicon
} from 'react-bootstrap';
import ResultsSummaryCard from './components/results-summary-card';
import ResultsCard from './components/results-card';
import ResultDetailCard from './components/result-detail-card';
import ResultsPoller from './components/results-poller-button';
import StatInkManualButton from './components/results-upload-manual-button';
import { event } from './analytics';
const { ipcRenderer } = require('electron');

const Results = () =>
  <Grid fluid style={{ marginTop: 65 }}>
    <Row>
      <Col md={12}>
        <ResultsContainer />
      </Col>
    </Row>
  </Grid>;

class ResultControl extends React.Component {
  state = {
    tokenExists: false,
    refreshing: false
  };

  componentDidMount() {
    const token = ipcRenderer.sendSync('getStatInkApiToken');
    this.setState({ tokenExists: token.length > 0 });
  }

  render() {
    const {
      result,
      resultIndex,
      changeResult,
      getResults,
      results,
      setStatInkInfo,
      statInk
    } = this.props;
    const { tokenExists } = this.state;

    const currentBattle = result.battle_number ? result.battle_number : 0;
    const uploaded = statInk ? statInk[currentBattle] != null : false;

    return (
      <ButtonToolbar style={{ marginBottom: 10 }}>
        <Button
          onClick={() => {
            getResults();
            event('results', 'refresh');
            this.setState({ refreshing: true });
            setTimeout(() => this.setState({ refreshing: false }), 2000);
          }}
          disabled={this.state.refreshing}
        >
          {this.state.refreshing ? 'Refreshed' : 'Refresh'}
        </Button>
        <ButtonGroup>
          <Button
            onClick={() => changeResult(resultIndex + 1)}
            disabled={resultIndex === results.length - 1}
          >
            <Glyphicon glyph="triangle-left" />
          </Button>
          <DropdownButton title={currentBattle} id={'battles'}>
            {results.map((result, idx) =>
              <MenuItem
                key={result.battle_number}
                onClick={() => changeResult(idx)}
              >
                {result.battle_number}
              </MenuItem>
            )}
          </DropdownButton>
          <Button
            onClick={() => changeResult(resultIndex - 1)}
            disabled={resultIndex === 0}
          >
            <Glyphicon glyph="triangle-right" />
          </Button>
        </ButtonGroup>
        <ButtonGroup>
          <StatInkManualButton
            result={result}
            currentBattle={currentBattle}
            disabled={!tokenExists}
            uploaded={uploaded}
            setStatInkInfo={setStatInkInfo}
          />
        </ButtonGroup>
        <ResultsPoller
          getResults={getResults}
          result={result}
          disabled={!tokenExists}
          setStatInkInfo={setStatInkInfo}
        />
      </ButtonToolbar>
    );
  }
}

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
        <ResultControl
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
