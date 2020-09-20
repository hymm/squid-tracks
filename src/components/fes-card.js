import React from 'react';
import { Card, Table, Container, Col, Row } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';

const FesTable = ({ fes_name, fes_id, fes_grade, fes_power }) => {
  return (
    <Col md={6} lg={4} xl={3}>
      <h4>{fes_name}</h4>
      <Table striped bordered hover>
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

const FesCard = ({ records, festivals, className }) => {
  const { fes_results = {} } = records;
  const fesArray = [];
  const fesVs = {};
  Object.keys(fes_results).forEach((fes) => {
    fesArray.push(fes_results[fes]);
  });

  Object.keys(festivals).forEach((fes) => {
    fesVs[festivals[fes].festival_id] =
      festivals[fes].names.alpha_short +
      ' vs. ' +
      festivals[fes].names.bravo_short;
  });

  return (
    <Card className={className}>
      <Card.Header>
        <FormattedMessage
          id="FesCard.title"
          defaultMessage="Splatfest Results"
        />
      </Card.Header>
      <Card.Body>
        <Container fluid>
          <Row>
            {fesArray.map((fes) => (
              <FesTable
                key={fes.fes_id}
                fes_name={fesVs[fes.fes_id]}
                fes_id={fes.fes_id}
                fes_grade={fes.fes_grade.name}
                fes_power={fes.fes_power}
              />
            ))}
          </Row>
        </Container>
      </Card.Body>
    </Card>
  );
};

export default FesCard;
