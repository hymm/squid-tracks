import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import ResultsCard from './components/results-card';
import ResultDetailCard from './components/result-detail-card';
import ResultsControl from './components/results-controls';
import { ipcRenderer } from 'electron';
import { Subscriber } from 'react-broadcast';
import lodash from 'lodash';

class Results extends React.Component {
  state = {
    currentResultIndex: 0,
    statInk: {}
  };

  componentDidMount() {
    this.getResults();
    const statInkInfo = ipcRenderer.sendSync('getFromStatInkStore', 'info');
    this.setState({ statInk: statInkInfo });
  }

  componentWillReceiveProps(nextProps) {
    const { splatnet } = this.props;
    const { splatnet: splatnetNext } = nextProps;
    const firstBattle = lodash.has(
      splatnet,
      'current.results.results[0].battle_number'
    )
      ? splatnet.current.results.results[0].battle_number
      : 0;

    const nextFirstBattle = lodash.has(
      splatnetNext,
      'current.results.results[0].battle_number'
    )
      ? splatnetNext.current.results.results[0].battle_number
      : 0;

    if (firstBattle !== nextFirstBattle) {
      this.setState({ initialized: true });
      if (nextFirstBattle != null) {
        splatnet.comm.getBattle(nextFirstBattle);
      }
    }
  }

  getResults = () => {
    const { splatnet } = this.props;
    splatnet.comm.updateResults();
  };

  changeResult = arrayIndex => {
    const { splatnet } = this.props;
    const results = splatnet.current.results.results;
    const battleNumber = results[arrayIndex].battle_number;
    splatnet.comm.getBattle(battleNumber);
    this.setState({
      currentResultIndex: arrayIndex
    });
  };

  getCurrentBattle() {
    const { currentResultIndex } = this.state;
    const { results } = this.props.splatnet.current.results;
    const battleNumber = results[currentResultIndex].battle_number;
    const battle = this.props.splatnet.cache.battles[battleNumber];
    return battle ? battle : {};
  }

  changeResultByBattleNumber = battleNumber => {
    const { splatnet } = this.props;
    splatnet.comm.getBattle(battleNumber);
    this.setState({
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
    const { statInk, currentResultIndex, initialized } = this.state;
    const results = this.props.splatnet.current.results;
    let currentBattle = {};
    if (initialized) {
      currentBattle = this.getCurrentBattle();
    }

    return (
      <Grid fluid style={{ marginTop: 65 }}>
        <Row>
          <Col md={12}>
            <ResultsControl
              result={currentBattle}
              resultIndex={currentResultIndex}
              results={results.results}
              changeResult={this.changeResult}
              getResults={this.getResults}
              setStatInkInfo={this.setStatInkInfo}
              statInk={statInk}
            />
            {!lodash.isEmpty(currentBattle) ? (
              <ResultDetailCard result={currentBattle} statInk={statInk} />
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
