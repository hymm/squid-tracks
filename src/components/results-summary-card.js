import React from 'react';
import { FormattedMessage } from 'react-intl';
import classnames from 'classnames';
import Timeline from './results-timeline';
import './results-summary-card.css';

const ResultsSummaryValueDisplay = ({ className, onClick, label, value }) => {
  return (
    <div
      className={className}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <h4>
        {label}
      </h4>
      <span>
        {value}
      </span>
    </div>
  );
};

const SelectableValue = ({
  className,
  activeValue,
  setActiveValue,
  ...props
}) => {
  return (
    <ResultsSummaryValueDisplay
      className={classnames(className, { active: activeValue === className })}
      onClick={() => {
        setActiveValue(className);
      }}
      {...props}
    />
  );
};

class ResultsSummaryCard extends React.Component {
  state = {
    activeValue: 'power'
  };

  setActiveValue = activeValue => {
    this.setState({ activeValue });
  };

  render() {
    const { summary, averages, results } = this.props;
    const { activeValue } = this.state;

    return (
      <div className="grid-wrapper">
        <ResultsSummaryValueDisplay
          className={'winLoss'}
          label={
            <FormattedMessage
              id="results.summary.winLoss"
              defaultMessage="W - L"
            />
          }
          value={`${summary.victory_count} - ${summary.defeat_count}`}
        />
        <ResultsSummaryValueDisplay
          className={'winPercent'}
          label={
            <FormattedMessage
              id="results.summary.winPercent"
              defaultMessage="W%"
            />
          }
          value={`${summary.victory_rate}`}
        />
        <SelectableValue
          className={'power'}
          setActiveValue={this.setActiveValue}
          activeValue={activeValue}
          label={
            <FormattedMessage
              id="results.summary.power"
              defaultMessage="Power"
            />
          }
          value={`${averages.power}`}
        />
        <SelectableValue
          className={'inked'}
          setActiveValue={this.setActiveValue}
          activeValue={activeValue}
          label={
            <FormattedMessage
              id="results.summary.inked"
              defaultMessage="Inked"
            />
          }
          value={`${averages.p}`}
        />
        <SelectableValue
          className={'killsAndAssists'}
          setActiveValue={this.setActiveValue}
          activeValue={activeValue}
          label={
            <FormattedMessage
              id="results.summary.killsAndAssists"
              defaultMessage="K+A (A)"
            />
          }
          value={`${averages.ka} (${averages.a})`}
        />
        <SelectableValue
          className={'killsAndDeaths'}
          setActiveValue={this.setActiveValue}
          activeValue={activeValue}
          label={
            <FormattedMessage
              id="results.summary.killsAndDeaths"
              defaultMessage="K - D"
            />
          }
          value={`${averages.k} - ${averages.d}`}
        />
        <SelectableValue
          className={'specials'}
          setActiveValue={this.setActiveValue}
          activeValue={activeValue}
          label={
            <FormattedMessage
              id="results.summary.specials"
              defaultMessage="S"
            />
          }
          value={`${averages.s}`}
        />
        <div className="timeline">
          <Timeline
            activeValue={activeValue}
            averages={averages}
            results={results}
          />
        </div>
      </div>
    );
  }
}

export default ResultsSummaryCard;
