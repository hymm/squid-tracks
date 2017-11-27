import React from 'react';
import {
  Grid,
  Row,
  Col,
  ButtonToolbar,
  ButtonGroup,
  Button,
  FormGroup,
  Checkbox,
  ControlLabel,
  FormControl,
  Form
} from 'react-bootstrap';
import LeagueRankings from './components/league-rankings';
import { event } from './analytics';
import update from 'immutability-helper';
import moment from 'moment';

import './meta.css';

const { ipcRenderer } = require('electron');

const Meta = () =>
  <Grid fluid style={{ marginTop: 65 }}>
    <Row>
      <Col md={12}>
        <MetaContainer />
      </Col>
    </Row>
  </Grid>;

class MetaContainer extends React.Component {
  state = {
    league_dict: {},
    refreshing: false,
    full_teams: true,
    region: 'ALL',
    title: 'Select Data Above',
    next_desired_start_of_week: 1,
    combine_replicas_toggle: false
  };

  url = 'league_match_ranking/';

  desired_start_of_week = 1;

  this_week_date_range_start = '';
  this_week_date_range_end = '';
  last_week_date_range_start = '';
  last_week_date_range_end = '';
  last_last_week_date_range_start = '';
  last_last_week_date_range_end = '';

  componentDidMount() {
    ipcRenderer.on('apiData', this.getMetaLoad);
    this.setState({
      combine_replicas_toggle: ipcRenderer.sendSync(
        'getFromStore',
        'combineReplicaLeagueStats'
      )
    });
  }

  componentWillUnmount() {
    ipcRenderer.removeListener('apiData', this.getMetaLoad);
  }

  getMetaRequest() {
    let endUtc = moment().utc().startOf('day');
    let startUtc = moment().utc();
    if (
      startUtc.hour() < 2 ||
      (startUtc.hour() === 2 && startUtc.minute() < 31)
    ) {
      startUtc.subtract(3, 'hours');
      endUtc.subtract(3, 'hours');
    }
    // gathers three weeks of data, where 'this week' may only be today
    if (startUtc.day() < this.state.next_desired_start_of_week) {
      startUtc.day(this.state.next_desired_start_of_week).subtract(1, 'week');
    } else {
      // if today is the desired day, 'this week' is one day intentionally
      startUtc.day(this.state.next_desired_start_of_week);
    }
    startUtc.startOf('day').subtract(2, 'week');

    this.this_week_date_range_end = endUtc.format('DMMM');

    while (endUtc.diff(startUtc, 'days') >= 0) {
      for (let i = 0; i < 24; i += 2) {
        let league_string =
          endUtc.format('YYMMDD') +
          ('0' + i).slice(-2) +
          (this.state.full_teams ? 'T' : 'P') +
          '/' +
          this.state.region;
        ipcRenderer.send(
          'getApiAsync',
          'league_match_ranking/' + league_string
        );
      }

      endUtc.subtract(1, 'day');
    }
  }

  getMetaLoad = (e, url, data) => {
    if (!url.includes(this.url)) {
      return;
    }

    if (typeof data === 'object' && data != null) {
      let newEntry = {};
      newEntry[data.league_id] = data;
      this.setState({
        league_dict: update(this.state.league_dict, { $merge: newEntry })
      });
    }
    this.desired_start_of_week = this.state.next_desired_start_of_week;
  };

  showPairs = () => {
    this.setState({ full_teams: false });
  };

  showTeams = () => {
    this.setState({ full_teams: true });
  };

  setRegion = e => {
    this.setState({ region: e.target.value });
  };

  handleChange = e => {
    this.setState({ league_time: e.target.value });
  };

  handleReplicaToggleClick = () => {
    event(
      'combineReplicaLeagueStats',
      !this.state.combine_replicas_toggle ? 'enabled' : 'disabled'
    );
    ipcRenderer.sendSync(
      'setToStore',
      'combineReplicaLeagueStats',
      !this.state.combine_replicas_toggle
    );
    this.setState({
      combine_replicas_toggle: !this.state.combine_replicas_toggle
    });
  };

  setDesiredStartDayOfWeek = e => {
    this.setState({ next_desired_start_of_week: e.target.value });
  };

  getWeekIndex(date, start_of_week) {
    let input_moment = moment(date);
    let now = moment().utc();
    if (now.hour() < 2 || (now.hour() === 2 && now.minute() < 31)) {
      now.subtract(3, 'hours');
    }
    if (now.day() < start_of_week) {
      now.day(start_of_week).subtract(1, 'week');
    } else {
      // if today is the desired day, 'this week' is one day intentionally
      now.day(start_of_week);
    }
    if (input_moment.isSameOrAfter(now.startOf('day'))) {
      this.this_week_date_range_start = input_moment.format('DMMM');
      this.last_week_date_range_end = input_moment
        .subtract(1, 'day')
        .format('DMMM');
      return 0;
    } else if (input_moment.isSameOrAfter(now.subtract(1, 'week'))) {
      this.last_week_date_range_start = input_moment.format('DMMM');
      this.last_last_week_date_range_end = input_moment
        .subtract(1, 'day')
        .format('DMMM');
      return 1;
    } else {
      this.last_last_week_date_range_start = input_moment.format('DMMM');
      return 2;
    }
  }

  getCalculatedWeaponStats(league_dict) {
    let weapons_stats = [];
    weapons_stats.push({});
    weapons_stats.push({});
    weapons_stats.push({});

    if (
      typeof league_dict === 'undefined' ||
      Object.keys(league_dict).length === 0
    ) {
      return {
        weapons_stats
      };
    }
    Object.keys(league_dict).forEach(league => {
      let week_index = this.getWeekIndex(
        league_dict[league].start_time * 1000,
        this.desired_start_of_week
      );
      Object.keys(league_dict[league].rankings).forEach(team => {
        Object.keys(
          league_dict[league].rankings[team].tag_members
        ).forEach(player => {
          let weap_name =
            league_dict[league].rankings[team].tag_members[player].weapon.name;
          let weap_id =
            league_dict[league].rankings[team].tag_members[player].weapon.id;
          let is_replica = false;
          if (this.state.combine_replicas_toggle) {
            const replica_equivalents = {
              '45': '40',
              '1015': '1010',
              '4015': '4010',
              '5015': '5010',
              '6005': '6000',
              '215': '210',
              '1115': '1110',
              '2015': '2010',
              '3005': '3000'
            };
            if (weap_id in replica_equivalents) {
              weap_id = replica_equivalents[weap_id];
              is_replica = true;
            }
          }
          if (weap_id in weapons_stats[week_index]) {
            if (!is_replica) {
              weapons_stats[week_index][weap_id].name = weap_name;
            }
            weapons_stats[week_index][weap_id].uses += 1;
            weapons_stats[week_index][weap_id].total_points +=
              league_dict[league].rankings[team].point;
          } else {
            weapons_stats[week_index][weap_id] = {
              name: weap_name,
              uses: 1,
              total_points: league_dict[league].rankings[team].point,
              avg_points: 0
            };
          }
        });
      });
    });

    let total_points_by_week = [];
    let total_uses_by_week = [];
    for (let i = 0; i < weapons_stats.length; i++) {
      let running_total_points_for_week = 0;
      let running_total_uses_for_week = 0;
      Object.keys(weapons_stats[i]).forEach(weapon => {
        running_total_points_for_week += weapons_stats[i][weapon].total_points;
        running_total_uses_for_week += weapons_stats[i][weapon].uses;
        weapons_stats[i][weapon].avg_points =
          weapons_stats[i][weapon].total_points / weapons_stats[i][weapon].uses;
      });
      total_points_by_week.push(running_total_points_for_week);
      total_uses_by_week.push(running_total_uses_for_week);
    }

    let totals = {
      uses: total_uses_by_week,
      total_points: total_points_by_week
    };

    return {
      weapons_stats,
      totals
    };
  }

  render() {
    return (
      <div>
        <Form inline className="league_top">
          <ButtonToolbar>
            <Button
              bsStyle="primary"
              onClick={() => {
                event(
                  'league_dict',
                  'refresh',
                  (this.state.full_teams ? 'team-' : 'pair-') +
                    this.state.region.toLowerCase()
                );
                this.setState({
                  refreshing: true,
                  league_dict: {},
                  title:
                    this.state.region +
                    ' Region ' +
                    (this.state.full_teams ? 'Teams' : 'Pairs') +
                    ' League Weapon Stats'
                });
                this.getMetaRequest();
                setTimeout(() => this.setState({ refreshing: false }), 4000);
              }}
              disabled={this.state.refreshing}
            >
              {this.state.refreshing ? 'Loaded' : 'Load Data'}
            </Button>
            <ButtonGroup>
              <Button onClick={this.showTeams} active={this.state.full_teams}>
                Teams
              </Button>
              <Button onClick={this.showPairs} active={!this.state.full_teams}>
                Pairs
              </Button>
            </ButtonGroup>

            <ButtonGroup>
              <Button
                onClick={this.setRegion}
                value="ALL"
                active={this.state.region === 'ALL'}
              >
                All Regions
              </Button>
              <Button
                onClick={this.setRegion}
                value="JP"
                active={this.state.region === 'JP'}
              >
                Japan
              </Button>
              <Button
                onClick={this.setRegion}
                value="US"
                active={this.state.region === 'US'}
              >
                NA/AU/NZ
              </Button>
              <Button
                onClick={this.setRegion}
                value="EU"
                active={this.state.region === 'EU'}
              >
                Europe
              </Button>
            </ButtonGroup>
            <FormGroup controlId="startOfWeekSelect">
              <ControlLabel className="text">Start of Week (UTC):</ControlLabel>
              <FormControl
                onChange={this.setDesiredStartDayOfWeek}
                componentClass="select"
                placeholder="Monday"
                value={this.state.next_desired_start_of_week}
              >
                <option value="0">Sunday</option>
                <option value="1">Monday</option>
                <option value="2">Tuesday</option>
                <option value="3">Wednesday</option>
                <option value="4">Thursday</option>
                <option value="5">Friday</option>
                <option value="6">Saturday</option>
              </FormControl>
            </FormGroup>
            <Checkbox
              className="text"
              checked={this.state.combine_replicas_toggle}
              onClick={this.handleReplicaToggleClick}
            >
              Combine Hero Versions
            </Checkbox>
          </ButtonToolbar>
        </Form>
        <br />
        <LeagueRankings
          handleChange={this.handleChange}
          calcStats={this.getCalculatedWeaponStats(this.state.league_dict)}
          title={this.state.title}
          this_week_date_range_start={this.this_week_date_range_start}
          this_week_date_range_end={this.this_week_date_range_end}
          last_week_date_range_start={this.last_week_date_range_start}
          last_week_date_range_end={this.last_week_date_range_end}
          last_last_week_date_range_start={this.last_last_week_date_range_start}
          last_last_week_date_range_end={this.last_last_week_date_range_end}
        />
      </div>
    );
  }
}

export default Meta;
