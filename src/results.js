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

class ResultsPoller extends React.Component {
  inactiveButtonText = 'Auto-upload to stat.ink';
  activeDefaultText = 'Waiting for Battle Data';

  state = {
    active: false,
    lastBattleUploaded: 0,
    buttonText: this.inactiveButtonText,
    writingToStatInk: false
  };

  componentDidMount() {
    ipcRenderer.on('wroteBattleAuto', this.handleWroteBattleAuto);
    ipcRenderer.on('writeBattleAutoError', this.handleError);
  }

  componentWillUnmount() {
    ipcRenderer.removeListener('wroteBattleAuto', this.handleWroteBattleAuto);
    ipcRenderer.removeListener('writeBattleAutoError', this.handleError);
  }

  start = () => {
    this.setState({ active: true, buttonText: this.activeDefaultText });
    this.poll(true);
  };

  stop = () => {
    this.setState({ active: false, buttonText: this.inactiveButtonText });
  };

  poll = start => {
    if (!this.state.active && !start) {
      return;
    }
    this.props.getResults();
    setTimeout(this.poll, 60000); // 2 minutes
  };

  handleClick = () => {
    if (this.state.active) {
      this.stop();
    } else {
      this.start();
    }
  };

  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.active &&
      this.props.result.battle_number &&
      this.props.result.battle_number > prevProps.result.battle_number
    ) {
      this.upload();
    }
  }

  upload = () => {
    const { result } = this.props;
    this.setState({
      buttonText: `Writing Battle #${result.battle_number}`,
      writingToStatInk: true
    });
    ipcRenderer.send('writeToStatInk', result, 'auto');
  };

  handleWroteBattleAuto = (e, info) => {
    const { result, setStatInkInfo } = this.props;
    event('stat.ink', 'wrote-battle', 'auto');
    this.setState({ buttonText: `Wrote Battle #${result.battle_number}` });

    if (info.username) {
      setStatInkInfo(result.battle_number, info);
    }
    setTimeout(
      () =>
        this.setState({
          buttonText: this.activeDefaultText,
          writingToStatInk: false
        }),
      10000
    );
  };

  handleError = (e, error) => {
    const { result } = this.props;
    this.setState({
      buttonText: `Error writing battle #${result.battle_number}`
    });
    setTimeout(
      () =>
        this.setState({
          buttonText: this.activeDefaultText,
          writingToStatInk: false
        }),
      10000
    );
  };

  render() {
    return (
      <Button
        onClick={this.handleClick}
        active={this.state.active}
        disabled={this.props.disabled}
      >
        {this.state.buttonText}
      </Button>
    );
  }
}

class StatInkManualButton extends React.Component {
  defaultButtonText = 'Upload to stat.ink';

  state = {
    buttonText: this.defaultButtonText,
    writingToStatInk: false
  };

  componentDidMount() {
    ipcRenderer.on('wroteBattleManual', this.handleWroteBattleManual);
    ipcRenderer.on('writeBattleManualError', this.handleError);
  }

  componentWillUnmount() {
    ipcRenderer.removeListener(
      'wroteBattleManual',
      this.handleWroteBattleManual
    );
    ipcRenderer.removeListener('writeBattlekManualError', this.handleError);
  }

  handleWroteBattleManual = (e, info) => {
    const { currentBattle, setStatInkInfo } = this.props;
    event('stat.ink', 'wrote-battle', 'manual');
    this.setState({ buttonText: `Wrote Battle #${currentBattle}` });

    if (info.username) {
      setStatInkInfo(currentBattle, info);
    }
    setTimeout(
      () =>
        this.setState({
          buttonText: this.defaultButtonText,
          writingToStatInk: false
        }),
      5000
    );
  };

  handleError = (e, error) => {
    setTimeout(
      () =>
        this.setState({
          buttonText: this.defaultButtonText,
          writingToStatInk: false
        }),
      5000
    );
  };

  handleClick = () => {
    const { currentBattle, result } = this.props;
    this.setState({
      buttonText: `Writing Battle #${currentBattle}`,
      writingToStatInk: true
    });
    ipcRenderer.send('writeToStatInk', result, 'manual');
  };

  render() {
    const { tokenExists } = this.props;
    const { writingToStatInk, buttonText } = this.state;

    return (
      <Button
        onClick={this.handleClick}
        disabled={!tokenExists || writingToStatInk}
      >
        {buttonText}
      </Button>
    );
  }
}

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
      setStatInkInfo
    } = this.props;

    const currentBattle = result.battle_number ? result.battle_number : 0;

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
            tokenExists={this.state.tokenExists}
            setStatInkInfo={setStatInkInfo}
          />
        </ButtonGroup>
        <ResultsPoller
          getResults={getResults}
          result={result}
          disabled={!this.state.tokenExists}
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
    const resultsPicked = results ? results : this.state.results.results
    const battleNumber = resultsPicked[arrayIndex].battle_number;
    this.setState({
      currentResult: ipcRenderer.sendSync('getApi', `results/${battleNumber}`),
      currentResultIndex: arrayIndex
    });
  };

  changeResultByBattleNumber = battleNumber => {
    this.setState({
      currentResult: ipcRenderer.sendSync('getApi', `results/${battleNumber}`),
      currentResultIndex: this.state.results.results.findIndex((a) => a.battle_number === battleNumber)
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
