import React from 'react';
import {
  Grid,
  Row,
  Col,
  ButtonToolbar,
  ButtonGroup,
  Button
} from 'react-bootstrap';
import LeagueRankings from './components/league-rankings';
import { event } from './analytics';
import update from 'immutability-helper';
import moment from 'moment';

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
    title: 'Select Data Above'
  };

  componentDidMount() {
    ipcRenderer.on('apiData', this.getMetaLoad);
  }

  getMetaRequest() {
    let endUtc = moment().startOf('day');
    let startUtc = moment();
    // goes back to the third monday back
    startUtc.startOf('isoWeek').subtract(2, 'week');

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

  getMetaLoad = (e, data) => {
    if (typeof data === 'object' && data != null) {
      let newEntry = {};
      newEntry[data.league_id] = data;
      this.setState({
        league_dict: update(this.state.league_dict, { $merge: newEntry })
      });
    }
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

  getWeekIndex(date) {
    let input_moment = moment(date);
    let now = moment();
    if (input_moment.isSameOrAfter(now.startOf('isoWeek'))) {
      return 0;
    } else if (input_moment.isSameOrAfter(now.subtract(1, 'week'))) {
      return 1;
    } else {
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
      let week_index = this.getWeekIndex(league_dict[league].start_time * 1000);
      Object.keys(league_dict[league].rankings).forEach(team => {
        Object.keys(
          league_dict[league].rankings[team].tag_members
        ).forEach(player => {
          const weap_name =
            league_dict[league].rankings[team].tag_members[player].weapon.name;
          if (weap_name in weapons_stats[week_index]) {
            weapons_stats[week_index][weap_name].uses += 1;
            weapons_stats[week_index][weap_name].total_points +=
              league_dict[league].rankings[team].point;
          } else {
            weapons_stats[week_index][weap_name] = {
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
        <ButtonToolbar style={{ marginBottom: '10px' }}>
          <Button
            bsStyle="primary"
            onClick={() => {
              event(
                'league_dict',
                'refresh',
                (this.state.full_teams ? 'team-' : 'pair-') +
                  this.state.region.toLowerCase()
              );
              this.getMetaRequest();
              this.setState({
                refreshing: true,
                league_dict: {},
                title:
                  this.state.region +
                  ' Region ' +
                  (this.state.full_teams ? 'Teams' : 'Pairs') +
                  ' League Weapon Stats'
              });
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
        </ButtonToolbar>
        <LeagueRankings
          handleChange={this.handleChange}
          calcStats={this.getCalculatedWeaponStats(this.state.league_dict)}
          title={this.state.title}
        />
      </div>
    );
  }
}

export default Meta;
