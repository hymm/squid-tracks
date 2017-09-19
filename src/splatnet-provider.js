import React from 'react';
import update from 'immutability-helper';
import { Broadcast } from 'react-broadcast';
import { ipcRenderer } from 'electron';
import log from 'electron-log';

class SplatnetProvider extends React.Component {
  state = {
    current: {
      results: {
        summary: {},
        results: []
      },
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
        ipcRenderer.send('getApiAsync', 'schedules');
      },
      updateRecords: () => {
        ipcRenderer.send('getApiAsync', 'records');
      },
      updateMerchandise: () => {
        ipcRenderer.send('getApiAsync', 'onlineshop/merchandises');
      },
      updateResults: () => {
        ipcRenderer.send('getApiAsync', 'results');
      },
      getBattle: (number, sync = false) => {
        const cachedBattle = this.state.cache.battles[number];
        if (cachedBattle != null) {
          return cachedBattle;
        }

        const storedBattle = ipcRenderer.sendSync('getBattleFromStore', number);
        if (storedBattle != null) {
          this.setBattleToCache(storedBattle);
          return storedBattle;
        }

        if (sync) {
          const freshBattle = ipcRenderer.sendSync(
            'getApi',
            `results/${number}`
          );
          this.setBattleToCache(freshBattle);
          this.setBattleToStore(freshBattle);
          return freshBattle;
        } else {
          ipcRenderer.send('getApi', `results/${number}`);
        }
      }
    }
  };

  componentDidMount() {
    ipcRenderer.on('apiData', this.handleApiData);
    ipcRenderer.on('apiDataError', this.handleApiError);
  }

  componentWillUnmount() {
    ipcRenderer.removeListener('apiData', this.handleApiData);
    ipcRenderer.removeListener('apiDataError', this.handleApiError);
  }

  handleApiData = (e, url, data) => {
    if (url.includes('results/')) {
      this.handleBattleResult(data);
      return;
    }

    switch (url) {
      case 'schedules':
        this.setState({
          current: update(this.state.current, { $merge: { schedule: data } })
        });
        return;
      case 'records':
        this.setState({
          current: update(this.state.current, { $merge: { records: data } })
        });
        return;
      case 'results':
        this.setState({
          current: update(this.state.current, { $merge: { results: data } })
        });
        return;
      case 'onlineshop/merchandises':
        this.setState({
          current: update(this.state.current, { $merge: { annie: data } })
        });
        return;
      default:
        return;
    }
  };

  handleBattleResult = battle => {};

  handleApiError = (e, err) => {
    log.error(err);
  };

  setBattleToCache(freshBattle) {
    const number = freshBattle.battle_number;
    const battles = update(this.state.cache.battles, {
      $merge: { [number]: freshBattle }
    });
    this.setState({
      cache: update(this.state.cache, { $merge: { battles: battles } })
    });
  }

  setBattleToStore(battle) {
    ipcRenderer.sendSync('setBattleToStore', battle);
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
