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
const { ipcRenderer } = window.require('electron');

const Results = () =>
  <Grid fluid>
    <Row>
      <Col md={12}>
        <ResultsContainer />
      </Col>
    </Row>
  </Grid>;

class ResultsPoller extends React.Component {
  state = {
    active: false,
    lastBattleUploaded: 0,
    activeText: 'Not Polling'
  };

  start = () => {
    this.setState({ active: true, activeText: 'Polling' });
    this.poll(true);
  };

  stop = () => {
    this.setState({ active: false });
  };

  poll = start => {
    if (!this.state.active && !start) {
      return;
    }
    this.props.getResults();
    setTimeout(this.poll, 120000); // 2 minutes
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
      this.props.result.battle_number &&
      this.props.result.battle_number > prevProps.result.battle_number
    ) {
      this.setState({
        activeText: `writing battle ${this.props.result.battle_number}`
      });
      ipcRenderer.sendSync('writeToStatInk', this.props.result);
      this.setState({
        activeText: `Wrote battle ${this.props.result.battle_number}`
      });
      setTimeout(() => {
        this.setState({ activeText: `Polling` });
      }, 10000);
    }
  }

  render() {
    return (
      <Button onClick={this.handleClick}>
        {this.state.active ? this.state.activeText : 'Auto-upload to stat.ink'}
      </Button>
    );
  }
}

class ResultControl extends React.Component {
  render() {
    const { latestBattleNumber, result, changeResult, getResults } = this.props;

    const currentBattle = result.battle_number;

    return (
      <ButtonToolbar style={{ marginBottom: 10 }}>
        <Button onClick={() => getResults()}>Refresh</Button>
        <ButtonGroup>
          <Button
            onClick={() => changeResult(parseInt(currentBattle, 10) + 1)}
            disabled={currentBattle === latestBattleNumber}
          >
            <Glyphicon glyph="triangle-left" />
          </Button>
          <DropdownButton title={currentBattle} id={'battles'}>
            {Array(50).fill().map((e, i) =>
              <MenuItem onClick={() => changeResult(latestBattleNumber - i)}>
                {latestBattleNumber - i}
              </MenuItem>
            )}
          </DropdownButton>
          <Button
            onClick={() => changeResult(currentBattle - 1)}
            disabled={currentBattle === latestBattleNumber + 50}
          >
            <Glyphicon glyph="triangle-right" />
          </Button>
        </ButtonGroup>
        <ButtonGroup>
          <Button
            onClick={() => ipcRenderer.sendSync('writeToStatInk', result)}
          >
            Upload to stat.ink
          </Button>
        </ButtonGroup>
        <ResultsPoller getResults={getResults} result={result} />
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
        <ResultControl
          latestBattleNumber={
            this.state.results.results[0]
              ? this.state.results.results[0].battle_number
              : 0
          }
          result={this.state.currentResult}
          changeResult={this.changeResult}
          getResults={this.getResults}
        />
        {this.state.initialized
          ? <ResultDetailCard result={this.state.currentResult} />
          : null}
        <ResultsSummaryCard summary={this.state.results.summary} />
        <ResultsCard
          results={this.state.results.results}
          changeResult={this.changeResult}
        />
      </div>
    );
  }
}

export default Results;
