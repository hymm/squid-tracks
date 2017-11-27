import React from 'react';
import { Button } from 'react-bootstrap';
import { ipcRenderer } from 'electron';
import { injectIntl, defineMessages } from 'react-intl';
import { event } from '../analytics';
class StatInkManualButton extends React.Component {
  messages = defineMessages({
    default: {
      id: 'results.uploadManual.default',
      defaultMessage: 'Upload to stat.ink',
      description: 'default upload manual button text'
    },
    wroteBattle: {
      id: 'results.uploadManual.wroteBattle',
      defaultMessage: 'Wrote Battle #{battle_number}'
    },
    writingBattle: {
      id: 'results.uploadManual.writingBattle',
      defaultMessage: 'Writing Battle #{battle_number}'
    },
    uploaded: {
      id: 'results.uploadManual.uploaded',
      defaultMessage: 'Uploaded',
      description: 'text to display if battle has been uploaded already'
    }
  });

  state = {
    buttonText: this.props.intl.formatMessage(this.messages.default),
    writingToStatInk: false,
    writingBattleNumber: 0
  };

  componentDidMount() {
    ipcRenderer.on('wroteBattleManual', this.handleWroteBattleManual);
    ipcRenderer.on('writeBattleManualError', this.handleError);
  }

  componentWillUnmount() {
    ipcRenderer.removeListener(
      'wroteBattleManual',
      this.handleWroteBattleManual
    );
    ipcRenderer.removeListener('writeBattlekManualError', this.handleError);
  }

  handleWroteBattleManual = (e, info) => {
    const { setStatInkInfo, intl } = this.props;
    const { writingBattleNumber } = this.state;
    event('stat.ink', 'wrote-battle', 'manual');
    this.setState({
      buttonText: intl.formatMessage(this.messages.wroteBattle, {
        battle_number: writingBattleNumber
      })
    });

    if (info.username) {
      setStatInkInfo(writingBattleNumber, info);
    }

    setTimeout(
      () =>
        this.setState({
          buttonText: intl.formatMessage(this.messages.default),
          writingToStatInk: false
        }),
      5000
    );
  };

  handleError = (e, error) => {
    const { intl } = this.props;
    setTimeout(
      () =>
        this.setState({
          buttonText: intl.formatMessage(this.messages.default),
          writingToStatInk: false
        }),
      5000
    );
  };

  handleClick = () => {
    const { currentBattle, result, intl } = this.props;
    this.setState({
      buttonText: intl.formatMessage(this.messages.writingBattle, {
        battle_number: currentBattle
      }),
      writingToStatInk: true,
      writingBattleNumber: result.battle_number
    });
    ipcRenderer.send('writeToStatInk', result, 'manual');
  };

  render() {
    const { disabled, uploaded, intl } = this.props;
    const { writingToStatInk, buttonText } = this.state;

    return (
      <Button
        onClick={this.handleClick}
        disabled={disabled || writingToStatInk || uploaded}
      >
        {uploaded && !writingToStatInk
          ? intl.formatMessage(this.messages.uploaded)
          : buttonText}
      </Button>
    );
  }
}

export default injectIntl(StatInkManualButton);
