import React from 'react';
import { Card, Table, Container, Row, Col } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';

const LeagueTable = ({ medals, max_rank }) => {
  return (
    <Table size="sm" striped bordered hover>
      <thead>
        <tr />
      </thead>
      <tbody>
        <tr>
          <td>
            <FormattedMessage
              id="LeagueCard.TableHeader.Max"
              defaultMessage="Max"
            />
          </td>
          <td>{max_rank}</td>
        </tr>
        <tr>
          <td>
            <FormattedMessage
              id="LeagueCard.TableHeader.Gold"
              defaultMessage="Gold"
            />
          </td>
          <td>{medals.gold_count}</td>
        </tr>
        <tr>
          <td>
            <FormattedMessage
              id="LeagueCard.TableHeader.Silver"
              defaultMessage="Silver"
            />
          </td>
          <td>{medals.silver_count}</td>
        </tr>
        <tr>
          <td>
            <FormattedMessage
              id="LeagueCard.TableHeader.Bronze"
              defaultMessage="Bronze"
            />
          </td>
          <td>{medals.bronze_count}</td>
        </tr>
        <tr>
          <td>
            <FormattedMessage
              id="LeagueCard.TableHeader.NoMedal"
              defaultMessage="No Medal"
            />
          </td>
          <td>{medals.no_medal_count}</td>
        </tr>
      </tbody>
    </Table>
  );
};

const LeagueCard = ({ records, className }) => {
  const { player, league_stats } = records;
  return (
    <Card className={className}>
      <Card.Header>
        <FormattedMessage id="LeagueCard.title" defaultMessage="League Stats" />
      </Card.Header>
      <Card.Body>
        <Container fluid>
          <Row>
            <Col md={6}>
              <h4>
                <FormattedMessage
                  id="LeagueCard.team.title"
                  defaultMessage="Team"
                />
              </h4>
              <LeagueTable
                max_rank={player.max_league_point_team}
                medals={league_stats.team}
              />
            </Col>
            <Col md={6}>
              <h4>
                <FormattedMessage
                  id="LeagueCard.pair.title"
                  defaultMessage="Pair"
                />
              </h4>
              <LeagueTable
                max_rank={player.max_league_point_pair}
                medals={league_stats.pair}
              />
            </Col>
          </Row>
        </Container>
      </Card.Body>
    </Card>
  );
};

export default LeagueCard;
