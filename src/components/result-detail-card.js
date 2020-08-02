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
  MenuItem,
  Label,
} from 'react-bootstrap';
import { pick, mapKeys, cloneDeep } from 'lodash';
import flatten from 'flat';
import { FormattedMessage } from 'react-intl';
import sillyname from 'sillyname';
import { nativeImage, ipcRenderer, clipboard, remote } from 'electron';
import lodash from 'lodash';

import BattleSummary from './result-detail-summary-2';
import TeamStatsTable from './team-stats-table';
import TeamGearTable from './team-gear-table';
import TeamInfoTable from './team-info-table';
import TeamRadarTotals from './team-radar-totals';
import PanelWithMenu from './panel-with-menu';
import TeamRadar from './team-radar';
import { getGeneralFields, getPlayerFields } from './export-detail-helpers';
import { event } from '../analytics';

import './result-detail-card.css';

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
      'rule.key': 'rule',
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
      game_paint_point: 'p',
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
    event('export-data', 'battle-simplified-json');
    const { result } = this.props;
    const simplified = this.simplify(result);
    clipboard.writeText(JSON.stringify(simplified));
  };

  copyToJson = () => {
    event('export-data', 'battle-json');
    const { result } = this.props;
    clipboard.writeText(JSON.stringify(result));
  };

  copyPicture = () => {
    event('export-data', 'battle-picture');
    const { result } = this.props;
    clipboard.writeImage(
      nativeImage.createFromBuffer(
        Buffer.from(ipcRenderer.sendSync('getSplatnetImage', result))
      )
    );
  };

  copyPictureURL = () => {
    event('export-data', 'battle-picture-url');
    const { result } = this.props;
    clipboard.writeText(ipcRenderer.sendSync('getSplatnetImageURL', result));
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
          <MenuItem onClick={this.copyPicture}>
            <FormattedMessage
              id="resultDetails.export.copyPicture"
              defaultMessage="Copy SplatNet Share picture"
            />
          </MenuItem>
          <MenuItem onClick={this.copyPictureURL}>
            <FormattedMessage
              id="resultDetails.export.copyPictureURL"
              defaultMessage="Copy SplatNet Share picture (URL)"
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

const TeamBadges = ({ power, id, theme }) => {
  return (
    <React.Fragment>
      {theme != null ? (
        <Label
          bsStyle="default"
          style={{
            fontWeight: 'normal',
            marginLeft: 5,
            marginRight: 5,
            background: theme.color.css_rgb,
          }}
        >
          {theme.name}
        </Label>
      ) : null}
      {power != null ? (
        <Label
          bsStyle="default"
          style={{
            fontWeight: 'normal',
            marginLeft: 5,
            marginRight: 5,
          }}
        >
          <FormattedMessage
            id="resultDetails.summary.estimatePower"
            defaultMessage="Estimate Power {power}"
            values={{ power: power }}
          />
        </Label>
      ) : null}
      {id ? (
        <Label
          bsStyle="default"
          style={{ fontWeight: 'normal', marginRight: 5 }}
        >
          {`${id}`}
        </Label>
      ) : null}
    </React.Fragment>
  );
};

class ResultDetailCard extends React.Component {
  state = {
    show: 1,
    anonymize: false,
  };

  showStats = () => {
    event('result-details', 'show-stats');
    this.setState({ show: 1 });
  };

  showGear = () => {
    event('result-details', 'show-gear');
    this.setState({ show: 2 });
  };

  showInfo = () => {
    event('result-details', 'show-info');
    this.setState({ show: 3 });
  };

  showRadarTeam = () => {
    event('result-details', 'show-radar-team');
    this.setState({ show: 4 });
  };

  showRadarTotals = () => {
    event('result-details', 'show-radar-game-totals');
    this.setState({ show: 5 });
  };

  calculateMaximums = (myTeam, otherTeam) => {
    const teams = myTeam.concat(otherTeam);
    const k = teams.reduce(
      (max, member) => (member.kill_count > max ? member.kill_count : max),
      0
    );
    const a = teams.reduce(
      (max, member) => (member.assist_count > max ? member.assist_count : max),
      0
    );
    const d = teams.reduce(
      (max, member) => (member.death_count > max ? member.death_count : max),
      0
    );
    const s = teams.reduce(
      (max, member) =>
        member.special_count > max ? member.special_count : max,
      0
    );
    const p = teams.reduce(
      (max, member) =>
        member.game_paint_point > max ? member.game_paint_point : max,
      0
    );

    const kad = [k, a, d].reduce(
      (max, value) => (value > max ? value : max),
      0
    );

    return { k: kad, a: kad, d: kad, s, p };
  };

  checkGear(skills) {
    const shiny = skills.subs.reduce((a, b) => {
      return a && b && b.id === skills.subs[0].id;
    }, true);
    if (shiny) {
      if (skills.subs[0].id === skills.main.id) {
        return 'pure';
      }
      return 'perfect';
    }
    return 'none';
  }

  checkPlayerGear(player) {
    const gearResults = [];
    gearResults.push(this.checkGear(player.head_skills));
    gearResults.push(this.checkGear(player.clothes_skills));
    gearResults.push(this.checkGear(player.shoes_skills));
    return this.reduceGear(gearResults);
  }

  reduceGear(gearResults) {
    const result = gearResults.reduce((a, b) => {
      if (a === 'pure' || b === 'pure') {
        return 'pure';
      }

      if (a === 'perfect' || b === 'perfect') {
        return 'perfect';
      }

      return 'none';
    }, 'none');
    return result;
  }

  getGearStyle() {
    const { result } = this.props;
    const gearResults = [];
    // don't check own gear
    // gearResults.push(this.checkPlayerGear(result.player_result.player));
    result.my_team_members.forEach((player) => {
      gearResults.push(this.checkPlayerGear(player.player));
    });
    result.other_team_members.forEach((player) => {
      gearResults.push(this.checkPlayerGear(player.player));
    });

    const res = this.reduceGear(gearResults);
    if (res === 'pure') {
      return 'success';
    }
    if (res === 'perfect') {
      return 'info';
    }
    return 'default';
  }

  anonymize(result) {
    const newResult = cloneDeep(result);
    for (const player of newResult.my_team_members) {
      player.player.nickname = sillyname();
    }
    for (const player of newResult.other_team_members) {
      player.player.nickname = sillyname();
    }
    return newResult;
  }

  render() {
    const { result, statInk } = this.props;
    const { anonymize } = this.state;

    if (lodash.isEmpty(result)) {
      return null;
    }

    const linkInfo = statInk[result.battle_number];
    const resultChanged = anonymize ? this.anonymize(result) : result;

    const myTeam = resultChanged.my_team_members.slice(0);
    myTeam.unshift(resultChanged.player_result);
    myTeam.sort((a, b) => b.sort_score - a.sort_score);
    const otherTeam = resultChanged.other_team_members
      .slice(0)
      .sort((a, b) => b.sort_score - a.sort_score);

    const maximums = this.calculateMaximums(myTeam, otherTeam);

    const myTeamPower =
      resultChanged.my_estimate_league_point != null
        ? resultChanged.my_estimate_league_point
        : resultChanged.my_estimate_fes_power != null
        ? resultChanged.my_estimate_fes_power
        : null;
    const otherTeamPower =
      resultChanged.other_estimate_league_point != null
        ? resultChanged.other_estimate_league_point
        : resultChanged.other_estimate_fes_power != null
        ? resultChanged.other_estimate_fes_power
        : null;

    return (
      <div className={resultChanged.game_mode.key}>
        <PanelWithMenu
          header={
            <h3 className="panel-title">
              <FormattedMessage
                id="resultDetails.title"
                defaultMessage="Battle #{battle_number} Details"
                values={{ battle_number: resultChanged.battle_number }}
              />
              {linkInfo ? (
                <button
                  className="button-as-link"
                  onClick={() =>
                    openExternal(
                      `https://stat.ink/@${linkInfo.username}/spl2/${linkInfo.battle}`
                    )
                  }
                  style={{ cursor: 'pointer' }}
                >
                  <Glyphicon glyph={'ok-sign'} style={{ paddingLeft: 6 }} />
                </button>
              ) : null}
            </h3>
          }
          menu={<ResultDetailMenu result={resultChanged} />}
        >
          <Grid fluid style={{ paddingLeft: 0, paddingRight: 0 }}>
            <Row>
              <Col md={12}>
                <BattleSummary result={resultChanged} />
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
                      <Glyphicon glyph="th" />
                    </Button>
                    <Button
                      onClick={this.showGear}
                      active={this.state.show === 2}
                      bsStyle={this.getGearStyle()}
                      style={{ padding: '8px 12px 4px 12px' }}
                    >
                      <svg width="16" height="14" viewBox="0 0 448 416">
                        <path
                          fill="#000"
                          d="M448 48L288 0c-13.988 27.227-30.771 40.223-63.769 40.223C191.723 39.676 173.722 27 160 0L0 48l32 88 64-8-16 288h288l-16-288 64 8 32-88z"
                        />
                      </svg>
                    </Button>
                    <Button
                      onClick={this.showRadarTotals}
                      active={this.state.show === 5}
                      style={{ padding: '8px 12px 4px 12px' }}
                    >
                      <svg width="14" height="14">
                        <polygon
                          points="7,0,13.062177826491,3.5,13.062177826491,10.5,7,14,0.93782217350893,10.5,0.93782217350893,3.5"
                          style={{
                            fill: '#000',
                          }}
                        />
                      </svg>
                    </Button>
                    <Button
                      onClick={this.showRadarTeam}
                      active={this.state.show === 4}
                      style={{ padding: '8px 12px 4px 12px' }}
                    >
                      <svg width="16" height="14">
                        <polygon
                          points="7,0,13.657395614066,4.8368810393754,11.114496766047,12.663118960625,2.8855032339527,12.663118960625,0.34260438593392,4.8368810393754"
                          style={{
                            fill: '#000',
                          }}
                        />
                      </svg>
                      <svg width="14" height="14">
                        <polygon
                          points="7,0,13.657395614066,4.8368810393754,11.114496766047,12.663118960625,2.8855032339527,12.663118960625,0.34260438593392,4.8368810393754"
                          style={{
                            fill: '#000',
                          }}
                        />
                      </svg>
                    </Button>
                    <Button
                      onClick={this.showInfo}
                      active={this.state.show === 3}
                    >
                      <Glyphicon glyph="option-horizontal" />
                    </Button>
                  </ButtonGroup>
                  <Button
                    onClick={() => {
                      event(
                        'result-details',
                        'anonymize',
                        !this.state.anonymize
                      );
                      this.setState({ anonymize: !this.state.anonymize });
                    }}
                    active={this.state.anonymize}
                  >
                    <FormattedMessage
                      id={'resultDetails.anonymizeButton.text'}
                      defaultMessage={'Anonymize'}
                    />
                  </Button>
                </ButtonToolbar>
              </Col>
            </Row>
            <Row>
              {this.state.show < 5 ? (
                [
                  <Col sm={6} md={6} key="myTeam">
                    <h4>
                      <FormattedMessage
                        id="resultDetails.teamsButton.myTeamTitle"
                        defaultMessage="My Team"
                      />
                      <TeamBadges
                        power={myTeamPower}
                        theme={result.my_team_fes_theme}
                        id={resultChanged.tag_id}
                      />
                    </h4>
                    {this.state.show === 1 ? (
                      <TeamStatsTable team={myTeam} result={result} />
                    ) : null}
                    {this.state.show === 2 ? (
                      <TeamGearTable team={myTeam} />
                    ) : null}
                    {this.state.show === 3 ? (
                      <TeamInfoTable team={myTeam} />
                    ) : null}
                    {this.state.show === 4 ? (
                      <TeamRadar team={myTeam} maximums={maximums} />
                    ) : null}
                  </Col>,
                  <Col sm={6} md={6} key="otherTeam">
                    <h4>
                      <FormattedMessage
                        id="resultDetails.teamsButton.otherTeamTitle"
                        defaultMessage="Enemy Team"
                      />
                      <TeamBadges
                        power={otherTeamPower}
                        theme={result.other_team_fes_theme}
                      />
                    </h4>
                    {this.state.show === 1 ? (
                      <TeamStatsTable team={otherTeam} result={result} />
                    ) : null}
                    {this.state.show === 2 ? (
                      <TeamGearTable team={otherTeam} />
                    ) : null}
                    {this.state.show === 3 ? (
                      <TeamInfoTable team={otherTeam} />
                    ) : null}
                    {this.state.show === 4 ? (
                      <TeamRadar team={otherTeam} maximums={maximums} />
                    ) : null}
                  </Col>,
                ]
              ) : (
                <Col md={12}>
                  <TeamRadarTotals
                    myTeam={myTeam}
                    myCount={
                      result.my_team_count != null
                        ? result.my_team_count
                        : result.my_team_percentage
                    }
                    otherTeam={otherTeam}
                    otherCount={
                      result.other_team_count != null
                        ? result.other_team_count
                        : result.other_team_percentage
                    }
                  />
                </Col>
              )}
            </Row>
          </Grid>
        </PanelWithMenu>
      </div>
    );
  }
}

export default ResultDetailCard;
