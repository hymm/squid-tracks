import React from 'react';
import update from 'immutability-helper';
import { Broadcast } from 'react-broadcast';
import { ipcRenderer } from 'electron';

class SplatnetProvider extends React.Component {
  state = {
    current: {
      results: {
        summary: {},
        results: []
      },
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
      },
      updateResults: () => {
        const results = ipcRenderer.sendSync('getApi', 'results');
        this.setState({
          current: update(this.state.current, { $merge: { results } })
        });
        return results;
      },
      getBattle: number => {
        const cachedBattle = this.state.cache.battles[number];
        if (cachedBattle != null) {
          return cachedBattle;
        }

        const freshBattle = ipcRenderer.sendSync('getApi', `results/${number}`);
        this.setBattleToCache(freshBattle);
        return freshBattle;
      }
    }
  };

  componentDidMount() {
    const battles = ipcRenderer.sendSync('getBattlesFromStore');
    this.setState({
      cache: update(this.state.cache, { $merge: { battles: battles } })
    });
  }

  setBattleToCache(freshBattle) {
    const number = freshBattle.battle_number;
    const battles = update(this.state.cache.battles, {
      $merge: { [number]: freshBattle }
    });
    this.setState({
      cache: update(this.state.cache, { $merge: { battles: battles } })
    });
    ipcRenderer.sendSync('setBattleToStore', freshBattle);
  }

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
