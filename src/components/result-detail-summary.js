import React from 'react';
import { Table } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';

export const ResultSummary2 = ({ result }) => (
  <Table striped bordered>
    <tbody>
      <tr>
        <th>
          <FormattedMessage
            id="results.summary.startTime"
            defaultMessage="Start Time"
          />
        </th>
        <td>{new Date(result.start_time * 1000).toString()}</td>
      </tr>
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
      {result.fes_power ? (
        <tr>
          <th>
            <FormattedMessage
              id="results.summary.fesPower"
              defaultMessage="Fes Power"
            />
          </th>
          <td>{result.fes_power}</td>
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
      {result.my_estimate_fes_power != null ? (
        <tr>
          <th>
            <FormattedMessage
              id="results.summary.myEstimateFestivalPower"
              defaultMessage="My Estimate Festival Power"
            />
          </th>
          <td>{result.my_estimate_fes_power}</td>
        </tr>
      ) : null}
      {result.other_estimate_fes_power != null ? (
        <tr>
          <th>
            <FormattedMessage
              id="results.summary.otherEstimateFestivalPower"
              defaultMessage="Other Estimate Festival Power"
            />
          </th>
          <td>{result.other_estimate_fes_power}</td>
        </tr>
      ) : null}
    </tbody>
  </Table>
);
