import React from 'react';
import update from 'immutability-helper';
import { withRouter } from 'react-router-dom';
import { Broadcast } from 'react-broadcast';
import { ipcRenderer } from 'electron';
import log from 'electron-log';
import produce from 'immer';
import { languages } from './components/language-select';

class SplatnetProvider extends React.Component {
  state = {
    current: {
      results: {
        summary: {},
        results: []
      },
      annieOriginal: [],
      annie: { merchandises: [] },
      schedule: { gachi: [], league: [], regular: [] },
      coop_schedules: { details: [], schedules: [] },
      records: {
        records: { player: { nickname: '' } }
      }
    },
    cache: {
      battles: {},
      league: {
        team: {},
        pair: {}
      }
    },
    lastError: {},
    comm: {
      updateCoop: () => {
        ipcRenderer.send('getApiAsync', 'coop_schedules');
      },
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
          ipcRenderer.send('getApiAsync', `results/${number}`);
          return;
        }
      }
    }
  };

  componentDidMount() {
    ipcRenderer.on('apiData', this.handleApiData);
    ipcRenderer.on('apiDataError', this.handleApiError);
    ipcRenderer.on('originalAbility', this.handleOriginalAbility);
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
      case 'coop_schedules':
        this.setState({
          current: update(this.state.current, {
            $merge: { coop_schedules: data }
          })
        });
        return;
      case 'schedules':
        this.setState(
          produce(draft => {
            draft.current.schedule = data;
          })
        );
        return;
      case 'records':
        this.setState(
          produce(draft => {
            draft.current.records = data;
          })
        );
        return;
      case 'results':
        this.setState(
          produce(draft => {
            draft.current.results = data;
          })
        );
        return;
      case 'onlineshop/merchandises':
        this.getOriginalAbilities(data);
        // data.original = [];
        this.setState({
          current: update(this.state.current, {
            $merge: { annie: data },
            annieOriginal: { $set: [] }
          })
        });
        return;
      default:
        return;
    }
  };

  getLocalizationString(locale) {
    const localizationRow = languages.find(l => l.code === locale);

    if (localizationRow == null) {
      throw new Error('locale string not found');
    }

    return localizationRow.statInk;
  }

  getOriginalAbilities(data) {
    const localization = this.getLocalizationString(this.props.locale);
    for (const merchandise of data.merchandises) {
      ipcRenderer.send(
        'getOriginalAbility',
        merchandise.kind,
        merchandise.gear.id,
        localization
      );
    }
  }

  handleOriginalAbility = (e, originalAbility) => {
    this.setState({
      current: update(this.state.current, {
        annieOriginal: { $push: [originalAbility] }
      })
    });
  };

  handleBattleResult = battle => {
    this.setBattleToCache(battle);
    this.setBattleToStore(battle);
  };

  handleApiError = (e, err) => {
    this.setState({ lastError: err });
    this.props.history.push('/error');
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

export default withRouter(SplatnetProvider);
