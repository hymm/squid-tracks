import React from 'react';
import { Button } from 'react-bootstrap';
import { Subscriber } from 'react-broadcast';
import { ipcRenderer } from 'electron';
import { injectIntl, defineMessages } from 'react-intl';
import { event } from '../analytics';

class UploadAllBattlesButton extends React.Component {
  messages = defineMessages({
    default: {
      id: 'results.uploadAll.default',
      defaultMessage: 'Upload All Battles to stat.ink'
    },
    checking: {
      id: 'results.uploadAll.checking',
      defaultMessage: 'Checking Battle #{battle_number}'
    },
    wroteBattle: {
      id: 'results.uploadAll.wroteBattle',
      defaultMessage: 'Wrote Battle #{battle_number}'
    },
    writingBattle: {
      id: 'results.uploadAll.writingBattle',
      defaultMessage: 'Writing Battle #{battle_number}'
    },
    done: {
      id: 'results.uploadAll.done',
      defaultMessage: 'Done'
    }
  });

  state = {
    uploading: false,
    buttonText: this.props.intl.formatMessage(this.messages.default),
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
    const { splatnet, statInk, intl } = this.props;
    const battle = this.props.splatnet.current.results.results[battleIdx];
    this.setState({
      currentIdx: battleIdx,
      buttonText: intl.formatMessage(this.messages.checking, {
        battle_number: battle.battle_number
      })
    });

    const uploaded = statInk ? statInk[battle.battle_number] != null : false;
    if (!uploaded) {
      const battleDetails = splatnet.comm.getBattle(
        battle.battle_number,
        'sync'
      );
      ipcRenderer.send('writeToStatInk', battleDetails, 'all');
      this.setState({
        buttonText: intl.formatMessage(this.messages.writingBattle, {
          battle_number: battle.battle_number
        })
      });
    } else {
      setTimeout(this.uploadNext, 100);
    }
  };

  uploadNext = () => {
    const { uploading, currentIdx } = this.state;
    if (uploading && currentIdx - 1 >= 0) {
      this.uploadBattle(currentIdx - 1);
    } else {
      this.finalizeUpload();
    }
  };

  handleWroteBattle = (e, info, number) => {
    const { setStatInkInfo, intl } = this.props;
    this.setState({
      buttonText: intl.formatMessage(this.messages.wroteBattle, {
        battle_number: number
      })
    });
    event('stat.ink', 'wrote-battle', 'auto');
    if (info.username) {
      setStatInkInfo(number, info);
    }

    this.uploadNext();
  };

  finalizeUpload = () => {
    const { intl } = this.props;
    this.setState({
      uploading: false,
      buttonText: intl.formatMessage(this.messages.done)
    });
    setTimeout(() => {
      this.setState({ buttonText: intl.formatMessage(this.messages.default) });
    }, 5000);
  };

  handleError = (e, error) => {
    this.uploadNext();
  };

  render() {
    const { buttonText } = this.state;
    return (
      <Button onClick={this.uploadAllBattles}>
        {buttonText}
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

export default injectIntl(UploadAllBattlesButtonInjected);
