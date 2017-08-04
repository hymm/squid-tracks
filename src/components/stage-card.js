import React from 'react';
import { Panel, ButtonGroup, Button, Table } from 'react-bootstrap';

export default class StageCard extends React.Component {
  state = {
    percent: false
  };

  showCount = () => {
    this.setState({ percent: false });
  };

  showPercent = () => {
    this.setState({ percent: true });
  };

  render() {
    const { stage_stats = {} } = this.props.records;
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

    return (
      <Panel header={<h3>Stage Stats</h3>}>
        <ButtonGroup>
          <Button onClick={this.showCount} active={!this.state.percent}>
            Count
          </Button>
          <Button onClick={this.showPercent} active={this.state.percent}>
            Percent
          </Button>
        </ButtonGroup>
        <Table striped bordered condensed hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>RM</th>
              <th>SZ</th>
              <th>TC</th>
              <th>Totals</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(stage_stats).map(stage =>
              <tr key={stage}>
                <td>
                  {stage_stats[stage].stage.name}
                </td>
                <td>
                  {this.state.percent
                    ? `${stage_stats[stage].hoko_percent.toFixed(2)}`
                    : `${stage_stats[stage].hoko_win} - ${stage_stats[stage]
                        .hoko_lose}`}
                </td>
                <td>
                  {this.state.percent
                    ? `${stage_stats[stage].area_percent.toFixed(2)}`
                    : `${stage_stats[stage].area_win} - ${stage_stats[stage]
                        .area_lose}`}
                </td>
                <td>
                  {this.state.percent
                    ? `${stage_stats[stage].yagura_percent.toFixed(2)}`
                    : `${stage_stats[stage].yagura_win} - ${stage_stats[stage]
                        .yagura_lose}`}
                </td>
                <td>
                  {this.state.percent
                    ? `${stage_stats[stage].total_percent.toFixed(2)}`
                    : `${stage_stats[stage].total_win} - ${stage_stats[stage]
                        .total_lose}`}
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr>
              <th>Totals</th>
              <td>
                {this.state.percent
                  ? `${rm_percent.toFixed(2)}`
                  : `${rm_win} - ${rm_lose}`}
              </td>
              <td>
                {this.state.percent
                  ? `${sz_percent.toFixed(2)}`
                  : `${sz_win} - ${sz_lose}`}
              </td>
              <td>
                {this.state.percent
                  ? `${tc_percent.toFixed(2)}`
                  : `${tc_win} - ${tc_lose}`}
              </td>
              <td>
                {this.state.percent
                  ? `${total_percent.toFixed(2)}`
                  : `${total_win} - ${total_lose}`}
              </td>
            </tr>
          </tfoot>
        </Table>
      </Panel>
    );
  }
}
