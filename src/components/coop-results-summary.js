import React, { useEffect } from 'react';
import { Table } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import { useCoopResults } from '../splatnet-coop-provider';

function CoopResultsSummary() {
  const [coopResults, refreshCoopResults] = useCoopResults();
  const { card } = coopResults.summary;

  useEffect(refreshCoopResults, []);

  return (
    <>
      <h4 style={{ marginTop: 0 }}>
        <FormattedMessage
          id="CoopResults.GrizzcoCard.Title"
          defaultMessage="Grizzco Point Card"
        />
      </h4>
      <Table striped bordered condensed hover>
        <thead>
          <tr />
        </thead>
        <tbody>
          <tr>
            <td>
              <FormattedMessage
                id="CoopResults.TableHeader.CurrentPoints"
                defaultMessage="Current Points"
              />
            </td>
            <td>{card.kuma_point}</td>
          </tr>
          <tr>
            <td>
              <FormattedMessage
                id="CoopResults.TableHeader.ShiftsWorked"
                defaultMessage="Shifts Worked"
              />
            </td>
            <td>{card.job_num}</td>
          </tr>
          <tr>
            <td>
              <FormattedMessage
                id="CoopResults.TableHeader.GoldenEggsCollected"
                defaultMessage="Golden Eggs Collected"
              />
            </td>
            <td>{card.golden_ikura_total}</td>
          </tr>
          <tr>
            <td>
              <FormattedMessage
                id="CoopResults.TableHeader.PowerEggsCollected"
                defaultMessage="Power Eggs Collected"
              />
            </td>
            <td>{card.ikura_total}</td>
          </tr>
          <tr>
            <td>
              <FormattedMessage
                id="CoopResults.TableHeader.CrewMembersRescued"
                defaultMessage="Crew Members Rescued"
              />
            </td>
            <td>{card.help_total}</td>
          </tr>
          <tr>
            <td>
              <FormattedMessage
                id="CoopResults.TableHeader.TotalPoints"
                defaultMessage="Total Points"
              />
            </td>
            <td>{card.kuma_point_total}</td>
          </tr>
        </tbody>
      </Table>
    </>
  );
}

export default CoopResultsSummary;
