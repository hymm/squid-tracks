import React from 'react';
import { Panel, Table } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';

const ResultsSummaryCard = ({ summary }) => {
  return (
    <Panel header={<h3>Last 50 Battles Summary</h3>}>
      <Table striped bordered condensed hover>
        <tbody>
          <tr>
            <td>
              <FormattedMessage
                id="resultsSummary.wins"
                defaultMessage="Wins"
              />
            </td>
            <td>{`${summary.victory_count}`}</td>
          </tr>
          <tr>
            <td>
              <FormattedMessage
                id="resultsSummary.losses"
                defaultMessage="Losses"
              />
            </td>
            <td>{`${summary.defeat_count}`}</td>
          </tr>
          <tr>
            <td>
              <FormattedMessage
                id="resultsSummary.winPercent"
                defaultMessage="Win Percent"
              />
            </td>
            <td>{`${summary.victory_rate}`}</td>
          </tr>
          <tr>
            <td>
              <FormattedMessage
                id="resultsSummary.kaAverage"
                defaultMessage="Kills + Assist Average"
              />
            </td>
            <td>{`${summary.kill_count_average}`}</td>
          </tr>
          <tr>
            <td>
              <FormattedMessage
                id="resultsSummary.killsAverage"
                defaultMessage="Kill Average"
              />
            </td>
            <td>{`${(summary.kill_count_average -
              summary.assist_count_average).toFixed(2)}`}</td>
          </tr>
          <tr>
            <td>
              <FormattedMessage
                id="resultsSummary.assistsAverage"
                defaultMessage="Assist Average"
              />
            </td>
            <td>{`${summary.assist_count_average}`}</td>
          </tr>
          <tr>
            <td>
              <FormattedMessage
                id="resultsSummary.deathsAverage"
                defaultMessage="Deaths Average"
              />
            </td>
            <td>{`${summary.death_count_average}`}</td>
          </tr>
          <tr>
            <td>
              <FormattedMessage
                id="resultsSummary.specialsAverage"
                defaultMessage="Special Count Average"
              />
            </td>
            <td>{`${summary.special_count_average}`}</td>
          </tr>
        </tbody>
      </Table>
    </Panel>
  );
};

export default ResultsSummaryCard;
