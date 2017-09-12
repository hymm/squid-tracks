import React from 'react';
import { Panel } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import Timeline from './results-timeline';
import './results-summary-card.css';

const ResultsSummaryCard = ({ summary }) => {
  return (
    <Panel header={<h3>Last 50 Battles Summary</h3>}>
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
        <div className="killsAndAssists">
          <h4>
            <FormattedMessage
              id="resultsSummary.killsAndAssists"
              defaultMessage="K+A (A)"
            />
          </h4>
          <span>
            {`${summary.kill_count_average} (${summary.assist_count_average})`}
          </span>
        </div>
        <div className="killsAndDeaths">
          <h4>
            <FormattedMessage
              id="resultsSummary.killsAndDeaths"
              defaultMessage="K - D"
            />
          </h4>
          <span>
            {`${(summary.kill_count_average -
              summary.assist_count_average).toFixed(
              2
            )} - ${summary.death_count_average}`}
          </span>
        </div>
        <div className="specials">
          <h4>
            <FormattedMessage id="resultsSummary.specials" defaultMessage="S" />
          </h4>
          <span>{`${summary.special_count_average}`}</span>
        </div>
      </div>
      <Timeline />
    </Panel>
  );
};

export default ResultsSummaryCard;
