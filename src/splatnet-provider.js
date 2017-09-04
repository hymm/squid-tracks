import React from 'react';
import update from 'immutability-helper';
import { Broadcast } from 'react-broadcast';
import { ipcRenderer } from 'electron';

class SplatnetProvider extends React.Component {
  state = {
    current: {
      results: {},
      records: {},
      annie: { merchandises: [] }
    },
    cache: {
      battles: {},
      league: {
        team: {},
        pair: {}
      }
    },
    comm: {
      updateMerchandise: () => {
        const annie = ipcRenderer.sendSync('getApi', 'onlineshop/merchandises');
        this.setState({
          current: update(this.state.current, { $merge: { annie } })
        });
      }
    }
  };

  render() {
    const { children } = this.props;
    return (
      <Broadcast channel="splatnet" value={this.state}>
        {children}
      </Broadcast>
    );
  }
}

export default SplatnetProvider;
