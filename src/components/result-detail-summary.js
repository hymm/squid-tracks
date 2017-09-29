import React from 'react';
import { Table } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';

export const ResultSummary2 = ({ result }) => (
  <Table striped bordered>
    <tbody>
      {result.win_meter != null ? (
        <tr>
          <th>
            <FormattedMessage
              id="results.summary.winMeter"
              defaultMessage="Win Meter"
            />
          </th>
          <td>{result.win_meter}</td>
        </tr>
      ) : null}
      {result.max_fes_poser != null ? (
        <tr>
          <th>
            <FormattedMessage
              id="results.summary.maxFestivalPower"
              defaultMessage="Max Festival Power"
            />
          </th>
          <td>{result.max_fes_poser}</td>
        </tr>
      ) : null}
    </tbody>
  </Table>
);
