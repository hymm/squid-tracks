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
      annie: { merchandises: [] },
      schedule: { gachi: [], league: [], regular: [] },
      records: {
        records: {}
      }
    },
    cache: {
      battles: {},
      league: {
        team: {},
        pair: {}
      }
    },
    comm: {
      updateSchedule: () => {
        const schedule = ipcRenderer.sendSync('getApi', 'schedules');
        this.setState({
          current: update(this.state.current, { $merge: { schedule } })
        });
      },
      updateRecords: () => {
        const records = ipcRenderer.sendSync('getApi', 'records');
        this.setState({
          current: update(this.state.current, { $merge: { records } })
        });
      },
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

        const storedBattle = ipcRenderer.sendSync('getBattleFromStore', number);
        if (storedBattle != null) {
          return storedBattle;
        }

        const freshBattle = ipcRenderer.sendSync('getApi', `results/${number}`);
        this.setBattleToCache(freshBattle);
        return freshBattle;
      }
    }
  };

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
