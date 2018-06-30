import React from 'react';
import { Panel, Table, Grid, Col } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';

const FesTable = ({ fes_id, fes_grade, fes_power }) => {
  return (
    <Col md={6}>
      <h4>{fes_id}</h4>
      <Table striped bordered condensed hover>
        <thead>
          <tr />
        </thead>
        <tbody>
          <tr>
            <td>
              <FormattedMessage
                id="FesCard.TableHeader.FestGrade"
                defaultMessage="Splatfest Grade"
              />
            </td>
            <td>{fes_grade}</td>
          </tr>
          <tr>
            <td>
              <FormattedMessage
                id="FesCard.TableHeader.FesPower"
                defaultMessage="Splatfest Power"
              />
            </td>
            <td>{fes_power / 10}</td>
          </tr>
        </tbody>
      </Table>
    </Col>
  );
};

const FesCard = ({ records }) => {
  const { fes_results = {} } = records;
  const fesArray = [];
  Object.keys(fes_results).forEach(fes => {
    fesArray.push(fes_results[fes]);
  });

  return (
    <Panel>
      <Panel.Heading>
        <FormattedMessage
          id="FesCard.title"
          defaultMessage="Splatfest Results"
        />
      </Panel.Heading>
      <Panel.Body>
        <Grid fluid>
          {fesArray.map(fes => (
            <FesTable
              key={fes.fes_id}
              fes_id={fes.fes_id}
              fes_grade={fes.fes_grade.name}
              fes_power={fes.fes_power}
            />
          ))}
        </Grid>
      </Panel.Body>
    </Panel>
  );
};

export default FesCard;
