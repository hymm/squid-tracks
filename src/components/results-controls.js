import React from 'react';
import {
  ButtonToolbar,
  Button,
  ButtonGroup,
  DropdownButton,
  Dropdown,
} from 'react-bootstrap';
import { FaCaretLeft, FaCaretRight } from 'react-icons/fa';
import { defineMessages, injectIntl } from 'react-intl';
import { ipcRenderer } from 'electron';
import StatInkManualButton from './results-upload-manual-button';
import ResultsPoller from './results-poller-button';
import { event } from '../analytics';
import ResultsUploadAll from './results-upload-all-battles';

class ResultControl extends React.Component {
  messages = defineMessages({
    refresh: {
      id: 'results.refreshButton.refresh',
      defaultMessage: 'Refresh',
    },
    refreshed: {
      id: 'results.refreshButton.refreshed',
      defaultMessage: 'Refreshed',
    },
  });

  state = {
    tokenExists: false,
    refreshing: false,
  };

  componentDidMount() {
    const token = ipcRenderer.sendSync('getStatInkApiToken');
    this.setState({ tokenExists: token.length > 0 });
  }

  render() {
    const {
      result,
      resultIndex,
      changeResult,
      getResults,
      results,
      setStatInkInfo,
      statInk,
      intl,
    } = this.props;
    const { tokenExists } = this.state;

    const currentBattle = result.battle_number ? result.battle_number : 0;
    const uploaded = statInk ? statInk[currentBattle] != null : false;

    return (
      <ButtonToolbar
        size="sm"
        variant="outline-dark"
        style={{ marginBottom: 10 }}
      >
        <Button
          size="sm"
          className="mr-2"
          variant="outline-secondary"
          onClick={() => {
            getResults();
            event('results', 'refresh');
            this.setState({ refreshing: true });
            setTimeout(() => this.setState({ refreshing: false }), 2000);
          }}
          disabled={this.state.refreshing}
        >
          {this.state.refreshing
            ? intl.formatMessage(this.messages.refreshed)
            : intl.formatMessage(this.messages.refresh)}
        </Button>
        <ButtonGroup className="mr-2" size="sm">
          <Button
            variant="outline-secondary"
            onClick={() => changeResult(resultIndex + 1)}
            disabled={resultIndex === results.length - 1}
          >
            <FaCaretLeft />
          </Button>
          <DropdownButton
            as={ButtonGroup}
            variant="outline-secondary"
            title={currentBattle}
            id={'battles'}
          >
            {results.map((result, idx) => (
              <Dropdown.Item
                key={result.battle_number}
                onClick={() => changeResult(idx)}
              >
                {result.battle_number}
              </Dropdown.Item>
            ))}
          </DropdownButton>
          <Button
            variant="outline-secondary"
            onClick={() => changeResult(resultIndex - 1)}
            disabled={resultIndex === 0}
          >
            <FaCaretRight />
          </Button>
        </ButtonGroup>
        <ButtonGroup className="mr-2">
          <StatInkManualButton
            result={result}
            currentBattle={currentBattle}
            disabled={!tokenExists}
            uploaded={uploaded}
            setStatInkInfo={setStatInkInfo}
          />
        </ButtonGroup>
        <ResultsPoller
          className="mr-1"
          getResults={getResults}
          result={result}
          disabled={!tokenExists}
          setStatInkInfo={setStatInkInfo}
        />
        <ResultsUploadAll statInk={statInk} setStatInkInfo={setStatInkInfo} />
      </ButtonToolbar>
    );
  }
}

export default injectIntl(ResultControl);
