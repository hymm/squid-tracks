import React from 'react';
import {
  Panel,
  ButtonGroup,
  ButtonToolbar,
  Button,
  Table,
  Grid,
  Col,
  Row
} from 'react-bootstrap';

export default class StageCard extends React.Component {
  state = {
    percent: false,
    sortColumn: '',
    sortDirection: 'up'
  };

  showCount = () => {
    this.setState({ percent: false });
  };

  showPercent = () => {
    this.setState({ percent: true });
  };

  getCalculatedStats(stage_stats) {
    let rm_win = 0,
      rm_lose = 0,
      tc_win = 0,
      tc_lose = 0,
      sz_win = 0,
      sz_lose = 0;
    Object.keys(stage_stats).forEach(weapon => {
      stage_stats[weapon].total_win =
        stage_stats[weapon].hoko_win +
        stage_stats[weapon].area_win +
        stage_stats[weapon].yagura_win;
      stage_stats[weapon].total_lose =
        stage_stats[weapon].hoko_lose +
        stage_stats[weapon].area_lose +
        stage_stats[weapon].yagura_lose;
      stage_stats[weapon].total_percent =
        stage_stats[weapon].total_win /
        (stage_stats[weapon].total_win + stage_stats[weapon].total_lose);
      stage_stats[weapon].hoko_percent =
        stage_stats[weapon].hoko_win /
        (stage_stats[weapon].hoko_win + stage_stats[weapon].hoko_lose);
      stage_stats[weapon].yagura_percent =
        stage_stats[weapon].yagura_win /
        (stage_stats[weapon].yagura_win + stage_stats[weapon].yagura_lose);
      stage_stats[weapon].area_percent =
        stage_stats[weapon].area_win /
        (stage_stats[weapon].area_win + stage_stats[weapon].area_lose);
      rm_win += stage_stats[weapon].hoko_win;
      rm_lose += stage_stats[weapon].hoko_lose;
      tc_win += stage_stats[weapon].yagura_win;
      tc_lose += stage_stats[weapon].yagura_lose;
      sz_win += stage_stats[weapon].area_win;
      sz_lose += stage_stats[weapon].area_lose;
    });
    const rm_percent = rm_win / (rm_win + rm_lose);
    const tc_percent = tc_win / (tc_win + tc_lose);
    const sz_percent = sz_win / (sz_win + sz_lose);
    const total_win = rm_win + tc_win + sz_win;
    const total_lose = rm_lose + tc_lose + sz_lose;
    const total_percent = total_win / (total_win + total_lose);

    return {
      rm_win,
      rm_lose,
      tc_win,
      tc_lose,
      sz_win,
      sz_lose,
      rm_percent,
      tc_percent,
      sz_percent,
      total_win,
      total_lose,
      total_percent
    };
  }

  sort(stage_stats) {
    // convert stage_stats to an array
    const stageStats = [];
    Object.keys(stage_stats).forEach(stage =>
      stageStats.push(stage_stats[stage])
    );

    if (this.state.sortColumn.length < 1) {
      return stageStats;
    }
    stageStats.sort((a, b) => {
      if (a[this.state.sortColumn] > b[this.state.sortColumn]) {
        return this.state.sortDirection === 'up' ? -1 : 1;
      }
      if (a[this.state.sortColumn] < b[this.state.sortColumn]) {
        return this.state.sortDirection === 'up' ? 1 : -1;
      }
      return 0;
    });
    return stageStats;
  }

  render() {
    const { stage_stats = {} } = this.props.records;

    const calcStats = this.getCalculatedStats(stage_stats);
    const sortedStats = this.sort(stage_stats);

    return (
      <Panel header={<h3>Stage Stats</h3>}>
        <Grid fluid>
          <Row>
            <Col sm={12} md={12}>
              <ButtonToolbar style={{ marginBottom: '10px' }}>
                <ButtonGroup>
                  <Button onClick={this.showCount} active={!this.state.percent}>
                    Count
                  </Button>
                  <Button
                    onClick={this.showPercent}
                    active={this.state.percent}
                  >
                    Percent
                  </Button>
                </ButtonGroup>
              </ButtonToolbar>
              * Click on column headers to sort by win percent
            </Col>
          </Row>
          <Row>
            <Col sm={12} md={12}>
              <Table striped bordered condensed hover>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th
                      onClick={() =>
                        this.setState({ sortColumn: 'hoko_percent' })}
                    >
                      RM
                    </th>
                    <th
                      onClick={() =>
                        this.setState({ sortColumn: 'area_percent' })}
                    >
                      SZ
                    </th>
                    <th
                      onClick={() =>
                        this.setState({ sortColumn: 'yagura_percent' })}
                    >
                      TC
                    </th>
                    <th
                      onClick={() =>
                        this.setState({ sortColumn: 'total_percent' })}
                    >
                      Totals
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedStats.map(stage =>
                    <tr key={stage.stage.name}>
                      <td>
                        {stage.stage.name}
                      </td>
                      <td>
                        {this.state.percent
                          ? `${stage.hoko_percent.toFixed(2)}`
                          : `${stage.hoko_win} - ${stage.hoko_lose}`}
                      </td>
                      <td>
                        {this.state.percent
                          ? `${stage.area_percent.toFixed(2)}`
                          : `${stage.area_win} - ${stage.area_lose}`}
                      </td>
                      <td>
                        {this.state.percent
                          ? `${stage.yagura_percent.toFixed(2)}`
                          : `${stage.yagura_win} - ${stage.yagura_lose}`}
                      </td>
                      <td>
                        {this.state.percent
                          ? `${stage.total_percent.toFixed(2)}`
                          : `${stage.total_win} - ${stage.total_lose}`}
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  <tr>
                    <th>Totals</th>
                    <td>
                      {this.state.percent
                        ? `${calcStats.rm_percent.toFixed(2)}`
                        : `${calcStats.rm_win} - ${calcStats.rm_lose}`}
                    </td>
                    <td>
                      {this.state.percent
                        ? `${calcStats.sz_percent.toFixed(2)}`
                        : `${calcStats.sz_win} - ${calcStats.sz_lose}`}
                    </td>
                    <td>
                      {this.state.percent
                        ? `${calcStats.tc_percent.toFixed(2)}`
                        : `${calcStats.tc_win} - ${calcStats.tc_lose}`}
                    </td>
                    <td>
                      {this.state.percent
                        ? `${calcStats.total_percent.toFixed(2)}`
                        : `${calcStats.total_win} - ${calcStats.total_lose}`}
                    </td>
                  </tr>
                </tfoot>
              </Table>
            </Col>
          </Row>
        </Grid>
      </Panel>
    );
  }
}
