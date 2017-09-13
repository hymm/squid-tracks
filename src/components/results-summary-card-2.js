import React from 'react';
import { Panel } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import Timeline from './results-timeline';
import './results-summary-card.css';

class ResultsSummaryCard extends React.Component {
  state = {
    activeValue: 'power'
  };

  render() {
    const { summary, averages } = this.props;
    return (
      <div className="grid-wrapper">
        <div className="winLoss">
          <h4>
            <FormattedMessage
              id="resultsSummary.winsLosses"
              defaultMessage="W - L"
            />
          </h4>
          <span>{`${summary.victory_count} - ${summary.defeat_count}`}</span>
        </div>
        <div className="winPercent">
          <h4>
            <FormattedMessage
              id="resultsSummary.winPercent"
              defaultMessage="W%"
            />
          </h4>
          <span>{`${summary.victory_rate}`}</span>
        </div>
        <div
          className="power active"
          onClick={() => {
            this.setState({ activeValue: 'power' });
          }}
        >
          <h4>
            <FormattedMessage
              id="resultsSummary.power"
              defaultMessage="Power"
            />
          </h4>
          <span>{`${averages.power}`}</span>
        </div>
        <div
          className="inked"
          onClick={() => {
            this.setState({ activeValue: 'player_result.game_paint_point' });
          }}
        >
          <h4>
            <FormattedMessage
              id="resultsSummary.inked"
              defaultMessage="Inked"
            />
          </h4>
          <span>{`${averages.p}`}</span>
        </div>
        <div
          className="killsAndAssists"
          onClick={() => {
            if (this.state.activeValue === 'player_result.assist_count') {
              this.setState({ activeValue: 'killsAndAssists' });
            } else {
              this.setState({ activeValue: 'player_result.assist_count' });
            }
          }}
        >
          <h4>
            <FormattedMessage
              id="resultsSummary.killsAndAssists"
              defaultMessage="K+A (A)"
            />
          </h4>
          <span>{`${averages.ka} (${averages.a})`}</span>
        </div>
        <div
          className="killsAndDeaths"
          onClick={() => {
            if (this.state.activeValue === 'player_result.kill_count') {
              this.setState({ activeValue: 'player_result.death_count' });
            } else {
              this.setState({ activeValue: 'player_result.kill_count' });
            }
          }}
        >
          <h4>
            <FormattedMessage
              id="resultsSummary.killsAndDeaths"
              defaultMessage="K - D"
            />
          </h4>
          <span>{`${averages.k} - ${averages.d}`}</span>
        </div>
        <div
          className="specials"
          onClick={() => {
            this.setState({ activeValue: 'player_result.special_count' });
          }}
        >
          <h4>
            <FormattedMessage id="resultsSummary.specials" defaultMessage="S" />
          </h4>
          <span>{`${averages.s}`}</span>
        </div>
        <div className="timeline">
          <Timeline activeValue={this.state.activeValue} />
        </div>
      </div>
    );
  }
}

export default ResultsSummaryCard;
