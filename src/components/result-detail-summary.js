import React from 'react';
import { Table } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';

export const ResultSummary1 = ({ result }) =>
  <Table striped bordered>
    <tbody>
      <tr>
        <th>
            <FormattedMessage
                id="results.summary.gameResult"
                defaultMessage="Result"
            />
        </th>
        <td>
          {result.my_team_result.name}
        </td>
      </tr>
      <tr>
        <th>
            <FormattedMessage
                id="results.summary.gameMode"
                defaultMessage="Game Mode"
            />
        </th>
        <td>
          {result.game_mode.name}
        </td>
      </tr>
      <tr>
        <th>
            <FormattedMessage
                id="results.summary.rule"
                defaultMessage="Rule"
            />
        </th>
        <td>
          {result.rule.name}
        </td>
      </tr>
      <tr>
        <th>
            <FormattedMessage
                id="results.summary.stage"
                defaultMessage="Stage"
            />
        </th>
        <td>
          {result.stage.name}
        </td>
      </tr>
    </tbody>
  </Table>;

export const ResultSummary2 = ({ result }) =>
  <Table striped bordered>
    <tbody>
      <tr>
        <th>
          <FormattedMessage
            id="results.summary.startTime"
            defaultMessage="Start Time"
          />
        </th>
        <td>
          {new Date(result.start_time * 1000).toString()}
        </td>
      </tr>
      {result.elapsed_time
        ? <tr>
            <th>
                <FormattedMessage
                  id="results.summary.duration"
                  defaultMessage="Duration"
                />
            </th>
            <td>
                <FormattedMessage
                  id="results.summary.elapsedTime"
                  defaultMessage="{elapsed_time} sec"
                  values={{ elapsed_time: result.elapsed_time }}
                />
            </td>
          </tr>
        : null}
      {result.tag_id
        ? <tr>
            <th>
                <FormattedMessage
                  id="results.summary.teamId"
                  defaultMessage="Team Id"
                  description="Team id is a unique id assigned by nintendo to a set of team members"
                />
            </th>
            <td>
              {result.tag_id}
            </td>
          </tr>
        : null}
      {result.my_team_percentage
        ? <tr>
            <th>
                <FormattedMessage
                  id="results.summary.score"
                  defaultMessage="Score"
                  description="Score of the game i.e. 100 - 0"
                />
            </th>
            <td>
              {`${result.my_team_percentage} - ${result.other_team_percentage}`}
            </td>
          </tr>
        : null}
      {result.my_team_count != null
        ? <tr>
            <th>
              <FormattedMessage
                id="results.summary.score"
                defaultMessage="Score"
                description="Score of the game i.e. 100 - 0"
              />
            </th>
            <td>{`${result.my_team_count} - ${result.other_team_count}`}</td>
          </tr>
        : null}
      {result.estimate_gachi_power
        ? <tr>
            <th>
                <FormattedMessage
                  id="results.summary.estimateGachiPower"
                  defaultMessage="Estimate Gachi Power"
                />
            </th>
            <td>
              {result.estimate_gachi_power}
            </td>
          </tr>
        : null}
      {result.fes_power
        ? <tr>
            <th>
                <FormattedMessage
                  id="results.summary.fesPower"
                  defaultMessage="Fes Power"
                />
            </th>
            <td>
              {result.fes_power}
            </td>
          </tr>
        : null}
      {result.my_estimate_league_point
        ? <tr>
            <th>
                <FormattedMessage
                  id="results.summary.myEstimateLeaguePower"
                  defaultMessage="My Estimate League Power"
                />
            </th>
            <td>
              {result.my_estimate_league_point}
            </td>
          </tr>
        : null}
      {result.league_point
        ? <tr>
            <th>
                <FormattedMessage
                  id="results.summary.leaguePoint"
                  defaultMessage="League Points"
                />
            </th>
            <td>
              {result.league_point}
            </td>
          </tr>
        : null}
      {result.max_league_point && result.max_league_point > 0
        ? <tr>
            <th>
                <FormattedMessage
                  id="results.summary.maxLeaguePoint"
                  defaultMessage="Max League Points"
                />
            </th>
            <td>
              {result.max_league_point}
            </td>
          </tr>
        : null}
      {result.win_meter != null
        ? <tr>
            <th>
                <FormattedMessage
                  id="results.summary.winMeter"
                  defaultMessage="Win Meter"
                />
            </th>
            <td>
                {result.win_meter}
            </td>
          </tr>
        : null}
    </tbody>
  </Table>;
