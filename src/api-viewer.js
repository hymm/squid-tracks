import React from 'react';
import Json from 'react-json-tree';
import { Link } from 'react-router-dom';
import { ButtonGroup, Button } from 'react-bootstrap';
const { ipcRenderer, clipboard } = require('electron');

class ApiAsyncButton extends React.Component {
  // defaultButtonText = 'Get API';

  // state = {
  //   data: {}
  // };

  componentDidMount() {
    ipcRenderer.on('apiData', this.handleApiData);
    // ipcRenderer.on('writeBattleManualError', this.handleError);
  }

  componentWillUnmount() {
    ipcRenderer.removeListener('apiData', this.handleApiData);
    // ipcRenderer.removeListener('writeBattlekManualError', this.handleError);
  }

  handleApiData = (e, data) => {
    const { setApiData } = this.props;
    // event('stat.ink', 'wrote-battle', 'manual');
    // this.setState({ buttonText: `Wrote Battle #${currentBattle}` });
    setApiData(data);
  };

  handleClick = () => {
    const { url } = this.props;
    // this.setState({
    // buttonText: `Writing Battle #${currentBattle}`,
    // writingToStatInk: true
    // });
    ipcRenderer.send('getApiAsync', url);
  };

  render() {
    // const { disabled, uploaded } = this.props;
    // const { writingToStatInk, buttonText } = this.state;

    return <Button onClick={this.handleClick}>Get API</Button>;
  }
}

class ApiTester extends React.Component {
  state = {
    reply: {},
    url: ''
  };

  urls = [
    'league_match_ranking/17073112T/ALL',
    'onlineshop/merchandises',
    'results',
    'results/180',
    'nickname_and_icon',
    'schedules',
    'records/hero',
    'timeline',
    'data/stages',
    'records',
    'festivals/active',
    'festivals/pasts',
    'festivals/2050/votes'
    // POST 'onlineshop/order/4780952683920142604',
    // POST 'share/profile'
    // POST 'share/results/630'
    // POST 'share/challenges/tenflod_squid_research_lab'
    // POST 'share/challenges/great_pyramid_at_giza'
  ];

  handleUrlChange = e => {
    this.setState({ url: e.target.value });
  };

  handleSelectChange = e => {
    this.setState({ url: e.target.value });
  };

  handlePostClick = () => {
    const res = ipcRenderer.sendSync('postApi', this.state.url);
    this.setState({ reply: res });
  };

  setApiData = data => {
    this.setState({ reply: data });
  };

  render() {
    return (
      <div style={{ marginTop: 65 }}>
        <Link to="/">
          <button>Back</button>
        </Link>
        <button onClick={this.handleButtonClick}>Get API</button>
        <ButtonGroup>
          <ApiAsyncButton url={this.state.url} setApiData={this.setApiData} />
        </ButtonGroup>
        <button onClick={this.handlePostClick}>Post API</button>
        <button
          onClick={() => clipboard.writeText(JSON.stringify(this.state.reply))}
        >
          Copy to Clipboard
        </button>
        <input
          type="text"
          value={this.state.url}
          onChange={this.handleUrlChange}
        />
        <select onClick={this.handleSelectChange}>
          {this.urls.map(url =>
            <option key={url} value={url}>
              {url}
            </option>
          )}
        </select>
        <Json data={this.state.reply} invertTheme={false} />
      </div>
    );
  }
}

export default ApiTester;
