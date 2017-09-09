import React from 'react';
import { Button } from 'react-bootstrap';
import { Subscriber } from 'react-broadcast';
import { ipcRenderer } from 'electron';
import { event } from '../analytics';

class UploadAllBattlesButton extends React.Component {
  componentDidMount() {
    console.log(this.props);
    ipcRenderer.on('wroteBattleAll', this.handleWroteBattle);
    ipcRenderer.on('writeBattleAllError', this.handleError);
  }

  componentWillUnmount() {
    ipcRenderer.removeListener('wroteBattleAll', this.handleWroteBattle);
    ipcRenderer.removeListener('writeBattleAllError', this.handleError);
  }

  uploadAllBattles = () => {
    const { splatnet, statInk } = this.props;

    for (const battle of splatnet.current.results.results) {
      const uploaded = statInk ? statInk[battle.battle_number] != null : false;
      if (!uploaded) {
        const battleDetails = splatnet.comm.getBattle(battle.battle_number);
        ipcRenderer.send('writeToStatInk', battleDetails, 'all');
      }
    }
  };

  handleWroteBattle = (e, info, number) => {
    const { setStatInkInfo } = this.props;
    event('stat.ink', 'wrote-battle', 'auto');
    if (info.username) {
      setStatInkInfo(number, info);
    }
  };

  handleError = (e, error) => {};

  render() {
    return (
      <Button onClick={this.uploadAllBattles}>
        Upload All Battles to stat.ink
      </Button>
    );
  }
}

const UploadAllBattlesButtonInjected = ({ ...args }) => {
  return (
    <Subscriber channel="splatnet">
      {splatnet => <UploadAllBattlesButton splatnet={splatnet} {...args} />}
    </Subscriber>
  );
};

export default UploadAllBattlesButtonInjected;
