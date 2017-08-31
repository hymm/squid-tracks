import React from 'react';
import {
  Grid,
  Row,
  Col,
  Glyphicon,
  ButtonToolbar,
  ButtonGroup,
  Button,
  Nav,
  NavDropdown,
  MenuItem
} from 'react-bootstrap';
import { pick, mapKeys } from 'lodash';
import flatten from 'flat';
import { FormattedMessage } from 'react-intl';
import TeamStatsTable from './team-stats-table';
import TeamGearTable from './team-gear-table';
import TeamInfoTable from './team-info-table';
import TeamRadarTotals from './team-radar-totals';
import PanelWithMenu from './panel-with-menu';
import TeamRadar from './team-radar';
import { ResultSummary1, ResultSummary2 } from './result-detail-summary';
import { getGeneralFields, getPlayerFields } from './export-detail-helpers';
import { clipboard, remote } from 'electron';
const { openExternal } = remote.shell;

class ResultDetailMenu extends React.Component {
  getFields() {
    let fields = getGeneralFields();
    fields = fields.concat(getPlayerFields(`player_result`));
    for (let i = 0; i < 3; i++) {
      fields = fields.concat(getPlayerFields(`my_team_members[${i}]`));
    }
    for (let i = 0; i < 4; i++) {
      fields = fields.concat(getPlayerFields(`other_team_members[${i}]`));
    }
    console.log(fields);
    return fields;
  }

  getGeneral(result) {
    const fields = getGeneralFields();
    const picked = pick(result, fields);
    const flattened = flatten(picked);

    const map = {
      'my_team_result.key': 'my_team_result',
      'other_team_result.key': 'other_team_result',
      'game_mode.key': 'game_mode',
      'rule.key': 'rule'
    };

    const mapped = mapKeys(flattened, (value, key) => {
      return map[key] || key;
    });

    return mapped;
  }

  getPlayer(player) {
    const fields = getPlayerFields();
    const picked = pick(player, fields);
    const flattened = flatten(picked);

    const map = {
      'player.nickname': 'nick',
      'player.principal_id': 'id',
      'player.weapon.id': 'weapon.id',
      kill_count: 'k',
      assist_count: 'a',
      death_count: 'd',
      special_count: 's',
      game_paint_point: 'p'
    };

    const mapped = mapKeys(flattened, (value, key) => {
      return map[key] || key;
    });

    return mapped;
  }

  simplify(result) {
    const simple = this.getGeneral(result);

    simple.my_team = [];

    simple.my_team.push(this.getPlayer(result.player_result));
    for (const player of result.my_team_members) {
      simple.my_team.push(this.getPlayer(player));
    }
    simple.other_team = [];
    for (const player of result.other_team_members) {
      simple.other_team.push(this.getPlayer(player));
    }

    return simple;
  }

  copySimplifiedToJson = () => {
    const { result } = this.props;
    const simplified = this.simplify(result);
    clipboard.writeText(JSON.stringify(simplified));
  };

  copyToJson = () => {
    const { result } = this.props;
    clipboard.writeText(JSON.stringify(result));
  };

  render() {
    return (
      <Nav className={'navbar-right pull-right'}>
        <NavDropdown
          id={'details-menu'}
          title={<Glyphicon glyph={'option-vertical'} />}
          noCaret
          pullRight
        >
          <MenuItem onClick={this.copySimplifiedToJson}>
            <FormattedMessage
              id="resultDetails.export.copySimpleJson"
              defaultMessage="Copy Simplified Json"
            />
          </MenuItem>
          <MenuItem onClick={this.copyToJson}>
            <FormattedMessage
              id="resultDetails.export.copyRawJson"
              defaultMessage="Copy Raw Json"
            />
          </MenuItem>
          <MenuItem divider />
          <MenuItem>
            <strike>
              <FormattedMessage
                id="resultDetails.export.saveToFile"
                defaultMessage="Save to File"
              />
            </strike>
          </MenuItem>
        </NavDropdown>
      </Nav>
    );
  }
}

class ResultDetailCard extends React.Component {
  state = {
    show: 1
  };

  showStats = () => {
    this.setState({ show: 1 });
  };

  showGear = () => {
    this.setState({ show: 2 });
  };

  showInfo = () => {
    this.setState({ show: 3 });
  };

  showRadarTeam = () => {
    this.setState({ show: 4 });
  };

  showRadarTotals = () => {
    this.setState({ show: 5 });
  };

  calculateMaximums = (myTeam, otherTeam) => {
    const teams = myTeam.concat(otherTeam);
    const k = teams.reduce((max, member) => member.kill_count > max ? member.kill_count : max, 0);
    const a = teams.reduce((max, member) => member.assist_count > max ? member.assist_count : max, 0);
    const d = teams.reduce((max, member) => member.death_count > max ? member.death_count : max, 0);
    const s = teams.reduce((max, member) => member.special_count > max ? member.special_count : max, 0);
    const p = teams.reduce((max, member) => member.game_paint_point > max ? member.game_paint_point : max, 0);

    const kad = [k, a, d].reduce((max, value) => value > max ? value : max, 0);

    return { k: kad, a: kad, d: kad, s, p };
  }

  render() {
    const { result, statInk } = this.props;
    const linkInfo = statInk[result.battle_number];
    if (!result) {
      return null;
    }

    const myTeam = result.my_team_members.slice(0);
    myTeam.unshift(result.player_result);
    myTeam.sort((a, b) => b.sort_score - a.sort_score);
    const otherTeam = result.other_team_members
      .slice(0)
      .sort((a, b) => b.sort_score - a.sort_score);

    const maximums = this.calculateMaximums(myTeam, otherTeam);

    return (
      <PanelWithMenu
        header={
          <h3 className="panel-title">
            <FormattedMessage
              id="resultDetails.title"
              defaultMessage="Battle #{battle_number} Details"
              values={{ battle_number: result.battle_number }}
            />
            {linkInfo
              ? <a
                  onClick={() =>
                    openExternal(
                      `https://stat.ink/@${linkInfo.username}/spl2/${linkInfo.battle}`
                    )}
                  style={{ cursor: 'pointer' }}
                >
                  <Glyphicon glyph={'ok-sign'} style={{ paddingLeft: 6 }} />
                </a>
              : null}
          </h3>
        }
        menu={<ResultDetailMenu result={result} />}
      >
        <Grid fluid>
          <Row>
            <Col sm={6} md={6}>
              <ResultSummary1 result={result} />
            </Col>
            <Col sm={6} md={6}>
              <ResultSummary2 result={result} />
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <ButtonToolbar style={{ marginBottom: '10px' }}>
                <ButtonGroup>
                  <Button
                    onClick={this.showStats}
                    active={this.state.show === 1}
                  >
                    <FormattedMessage
                      id="resultDetails.teamsButton.stats"
                      defaultMessage="Stats"
                    />
                  </Button>
                  <Button
                    onClick={this.showGear}
                    active={this.state.show === 2}
                  >
                    <FormattedMessage
                      id="resultDetails.teamsButton.gear"
                      defaultMessage="Gear"
                    />
                  </Button>
                  <Button
                    onClick={this.showInfo}
                    active={this.state.show === 3}
                  >
                    <FormattedMessage
                      id="resultDetails.teamsButton.moreInfo"
                      defaultMessage="More Info"
                    />
                  </Button>
                  <Button
                    onClick={this.showRadarTeam}
                    active={this.state.show === 4}
                  >
                    <Glyphicon glyph='unchecked' />
                    <Glyphicon glyph='unchecked' />
                  </Button>
                  <Button
                    onClick={this.showRadarTotals}
                    active={this.state.show === 5}
                  >
                    <Glyphicon glyph='unchecked' />
                  </Button>
                </ButtonGroup>
              </ButtonToolbar>
            </Col>
          </Row>
          <Row>
            {this.state.show < 5 ?
                [
                    <Col sm={6} md={6}>

                  <h4>
                    <FormattedMessage
                      id="resultDetails.teamsButton.myTeamTitle"
                      defaultMessage="My Team"
                    />
                  </h4>
                  {this.state.show === 1 ? <TeamStatsTable team={myTeam} /> : null}
                  {this.state.show === 2 ? <TeamGearTable team={myTeam} /> : null}
                  {this.state.show === 3 ? <TeamInfoTable team={myTeam} /> : null}
                  {this.state.show === 4 ? <TeamRadar team={myTeam} maximums={maximums} /> : null}
              </Col>,
                <Col sm={6} md={6}>
                  <h4>
                    <FormattedMessage
                      id="resultDetails.teamsButton.otherTeamTitle"
                      defaultMessage="Enemy Team"
                    />
                  </h4>
                  {this.state.show === 1
                    ? <TeamStatsTable team={otherTeam} />
                    : null}
                  {this.state.show === 2
                    ? <TeamGearTable team={otherTeam} />
                    : null}
                  {this.state.show === 3
                    ? <TeamInfoTable team={otherTeam} />
                    : null}
                  {this.state.show === 4 ? <TeamRadar team={otherTeam} maximums={maximums} /> : null}
                </Col>
            ]
            :
                <Col md={12}>
                    <TeamRadarTotals
                        myTeam={myTeam}
                        myCount={result.my_team_count != null ? result.my_team_count : result.my_team_percentage}
                        otherTeam={otherTeam}
                        otherCount={result.other_team_count != null ? result.other_team_count : result.other_team_percentage}
                    />
                </Col>
            }
          </Row>
        </Grid>
      </PanelWithMenu>
    );
  }
}

export default ResultDetailCard;
