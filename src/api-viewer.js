import React from 'react';
import ReactJson from 'react-json-view';
import splatnet from './splatnet2';

class ApiTester {
  state = {
    reply: {}
  };

  async handleButtonClick() {
    const league = await splatnet.getLeagueResults();
    this.setState({ reply: league });
  }

  render() {
    return (
      <div>
        <button onClick={this.handleButtonClick}>Get API</button>
        <ReactJson data={this.state.reply} />
      </div>
    );
  }
}

export default ApiTester;
