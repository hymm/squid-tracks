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
    currentResultIndex: -1,
    statInk: {},
    initialized: false
  };

  componentDidMount() {
    this.getResults();
    const statInkInfo = ipcRenderer.sendSync('getFromStatInkStore', 'info');
    this.setState({
      statInk: statInkInfo,
      initialized: false,
      currentResultIndex: 0
    });
    console.log('results did mount');
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
    const { splatnet } = this.props;
    const { currentResultIndex } = this.state;

    const { results } = this.props.splatnet.current.results;

    if (
      results[currentResultIndex] == null ||
      results[currentResultIndex].battle_number == null
    ) {
      return {};
    }
    const battleNumber = results[currentResultIndex].battle_number;

    if (this.props.splatnet.cache.battles[battleNumber] == null) {
      splatnet.comm.getBattle(battleNumber);
      return {};
    }

    const battle = this.props.splatnet.cache.battles[battleNumber];
    return battle;
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
    const { statInk, currentResultIndex } = this.state;
    const results = this.props.splatnet.current.results;
    const currentBattle = this.getCurrentBattle();

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
