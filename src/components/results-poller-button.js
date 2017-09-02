import React from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import { ipcRenderer } from 'electron';
import { Button } from 'react-bootstrap';

import { event } from '../analytics';

class ResultsPoller extends React.Component {
  messages = defineMessages({
    inactive: {
      id: 'results.autoupload.inactiveButton',
      defaultMessage: 'Auto-upload to stat.ink'
    },
    activeDefault: {
      id: 'results.autoupload.activeDefault',
      defaultMessage: 'Waiting for Battle Data'
    },
    writingBattle: {
      id: 'results.autoupload.writingBattle',
      defaultMessage: 'Writing Battle #{battle_number}'
    },
    wroteBattle: {
      id: 'results.autoupload.wroteBattle',
      defaultMessage: 'Wrote Battle #{battle_number}'
    },
    error: {
      id: 'results.autoupload.error',
      defaultMessage: 'Error Writing Battle #{battle_number}'
    }
  });

  state = {
    active: false,
    lastBattleUploaded: 0,
    buttonText: this.props.intl.formatMessage(this.messages.inactive),
    writingToStatInk: false
  };

  componentDidMount() {
    ipcRenderer.on('wroteBattleAuto', this.handleWroteBattleAuto);
    ipcRenderer.on('writeBattleAutoError', this.handleError);
  }

  componentWillUnmount() {
    ipcRenderer.removeListener('wroteBattleAuto', this.handleWroteBattleAuto);
    ipcRenderer.removeListener('writeBattleAutoError', this.handleError);
  }

  start = () => {
    const { intl } = this.props;
    this.setState({
      active: true,
      buttonText: intl.formatMessage(this.messages.activeDefault)
    });
    this.poll(true);
  };

  stop = () => {
    const { intl } = this.props;
    this.setState({
      active: false,
      buttonText: intl.formatMessage(this.messages.inactive)
    });
  };

  poll = start => {
    if (!this.state.active && !start) {
      return;
    }
    this.props.getResults();
    setTimeout(this.poll, 60000); // 2 minutes
  };

  handleClick = () => {
    if (this.state.active) {
      this.stop();
    } else {
      this.start();
    }
  };

  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.active &&
      this.props.result.battle_number &&
      this.props.result.battle_number > prevProps.result.battle_number
    ) {
      this.upload();
    }
  }

  upload = () => {
    const { result, intl } = this.props;
    this.setState({
      buttonText: intl.formatMessage(this.messages.writingBattle, {
        battle_number: result.battle_number
      }),
      writingToStatInk: true
    });
    ipcRenderer.send('writeToStatInk', result, 'auto');
  };

  handleWroteBattleAuto = (e, info) => {
    const { result, setStatInkInfo, intl } = this.props;
    event('stat.ink', 'wrote-battle', 'auto');
    this.setState({
      buttonText: intl.formatMessage(this.messages.wroteBattle, {
        battle_number: result.battle_number
      })
    });

    if (info.username) {
      setStatInkInfo(result.battle_number, info);
    }
    setTimeout(
      () =>
        this.setState({
          buttonText: intl.formatMessage(this.messages.activeDefault),
          writingToStatInk: false
        }),
      10000
    );
  };

  handleError = (e, error) => {
    const { result, intl } = this.props;
    this.setState({
      buttonText: intl.formatMessage(this.messages.error, {
        battle_number: result.battle_number
      })
    });
    setTimeout(
      () =>
        this.setState({
          buttonText: intl.formatMessage(this.messages.activeDefault),
          writingToStatInk: false
        }),
      10000
    );
  };

  render() {
    return (
      <Button
        onClick={this.handleClick}
        active={this.state.active}
        disabled={this.props.disabled}
      >
        {this.state.buttonText}
      </Button>
    );
  }
}

export default injectIntl(ResultsPoller);
