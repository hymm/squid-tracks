import React from 'react';
import Json from 'react-json-tree';
import { Link } from 'react-router-dom';
const { ipcRenderer, clipboard } = require('electron');

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

  handleButtonClick = async () => {
    const league = ipcRenderer.sendSync('getApi', this.state.url);
    this.setState({ reply: league });
  };

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

  render() {
    return (
      <div style={{ marginTop: 65 }}>
        <Link to="/">
          <button>Back</button>
        </Link>
        <button onClick={this.handleButtonClick}>Get API</button>
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
          {this.urls.map(url => (
            <option key={url} value={url}>
              {url}
            </option>
          ))}
        </select>
        <Json data={this.state.reply} invertTheme={false} />
      </div>
    );
  }
}

export default ApiTester;
