import React from 'react';
import { Panel, Table } from 'react-bootstrap';

const ResultsSummaryCard = ({ summary }) => {
  return (
    <Panel header={<h3>Results Summary</h3>}>
      <Table striped bordered condensed hover>
        <tbody>
          <tr>
            <td>Wins</td>
            <td>{`${summary.victory_count}`}</td>
          </tr>
          <tr>
            <td>Losses</td>
            <td>{`${summary.defeat_count}`}</td>
          </tr>
          <tr>
            <td>Win Percent</td>
            <td>{`${summary.victory_rate}`}</td>
          </tr>
          <tr>
            <td>Kills + Assist Average</td>
            <td>{`${summary.kill_count_average}`}</td>
          </tr>
          <tr>
            <td>Kill Average</td>
            <td>{`${summary.kill_count_average -
              summary.assist_count_average}`}</td>
          </tr>
          <tr>
            <td>Assist Average</td>
            <td>{`${summary.assist_count_average}`}</td>
          </tr>
          <tr>
            <td>Deaths Average</td>
            <td>{`${summary.death_count_average}`}</td>
          </tr>
          <tr>
            <td>Special Count Average</td>
            <td>{`${summary.special_count_average}`}</td>
          </tr>
        </tbody>
      </Table>
    </Panel>
  );
};

export default ResultsSummaryCard;
