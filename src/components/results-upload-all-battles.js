import React from 'react';
import { Button } from 'react-bootstrap';
import { Subscriber } from 'react-broadcast';
import { ipcRenderer } from 'electron';
import { event } from '../analytics';

class UploadAllBattlesButton extends React.Component {
  state = {
    uploading: false,
    currentIdx: 0
  };

  componentDidMount() {
    ipcRenderer.on('wroteBattleAll', this.handleWroteBattle);
    ipcRenderer.on('writeBattleAllError', this.handleError);
  }

  componentWillUnmount() {
    ipcRenderer.removeListener('wroteBattleAll', this.handleWroteBattle);
    ipcRenderer.removeListener('writeBattleAllError', this.handleError);
  }

  uploadAllBattles = () => {
    this.initializeUpload();
    const startIdx = this.props.splatnet.current.results.results.length - 1;
    this.uploadBattle(startIdx);
  };

  initializeUpload = () => {
    this.setState({ uploading: true });
  };

  uploadBattle = battleIdx => {
    const { splatnet, statInk } = this.props;
    this.setState({ currentIdx: battleIdx });
    const battle = this.props.splatnet.current.results.results[battleIdx];

    const uploaded = statInk ? statInk[battle.battle_number] != null : false;
    if (!uploaded) {
      const battleDetails = splatnet.comm.getBattle(battle.battle_number);
      ipcRenderer.send('writeToStatInk', battleDetails, 'all');
    } else {
      setTimeout(this.uploadNext, 100);
    }
  };

  uploadNext = () => {
    const { uploading, currentIdx } = this.state;
    console.log(this.state);
    if (uploading && currentIdx - 1 >= 0) {
      this.uploadBattle(currentIdx - 1);
    } else {
      this.finalizeUpload();
    }
  };

  handleWroteBattle = (e, info, number) => {
    const { setStatInkInfo, splatnet } = this.props;

    event('stat.ink', 'wrote-battle', 'auto');
    if (info.username) {
      setStatInkInfo(number, info);
    }

    this.uploadNext();
  };

  finalizeUpload = () => {
    this.setState({ uploading: false });
  };

  handleError = (e, error) => {
    this.uploadNext();
  };

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
