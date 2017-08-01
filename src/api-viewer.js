import React from 'react';
import Json from 'react-json-tree';
import { Link } from 'react-router-dom';
const remote = window.require('electron').remote;
const { getApi } = remote.require('./main.js');

class ApiTester extends React.Component {
  state = {
    reply: {},
    url: '',
  };

  handleButtonClick = async () => {
    const league = await getApi(this.state.url);
    this.setState({ reply: league });
  }

  handleUrlChange = (e) => {
      this.setState({ url: e.target.value });
  }

  handleSelectChange = (e) => {
      this.setState({ url: e.target.value });
  }

  render() {
    return (
      <div>
        <Link to="/"><button onClick={this.handleButtonClick}>Back</button></Link>
        <button onClick={this.handleButtonClick}>Get API</button>
        <input type="text" value={this.state.url} onChange={this.handleUrlChange} />
        <select onClick={this.handleSelectChange}>
          <option value='league_match_ranking/17073112T/ALL'>league_match_ranking/17073112T/ALL</option>
        </select>
        <Json data={this.state.reply} invertTheme={false} />
      </div>
    );
  }
}

export default ApiTester;
