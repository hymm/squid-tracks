import React from 'react';
import { Subscriber } from 'react-broadcast';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  Cell,
  YAxis,
  CartesianGrid,
  ReferenceLine,
  Dot
} from 'recharts';

class ResultDot extends React.Component {
  render() {
    const { payload } = this.props;
    if (payload.result === 'victory') {
      return <Dot {...this.props} />;
    }
    return null;
  }
}

class ResultsTimeline extends React.Component {
  getModeColor(lobby) {
    let color = 'grey';
    switch (lobby) {
      case 'regular':
        color = 'rgb(152, 207, 4)';
        break;
      case 'gachi':
        color = 'rgb(249, 114, 7)';
        break;
      case 'league_pair':
        color = 'rgb(228, 24, 113)';
        break;
      case 'league_team':
        color = 'rgb(228, 24, 113)';
        break;
      case 'private':
        color = 'rgb(157, 0, 200)';
        break;
      default:
        color = 'lightgrey';
    }
    return color;
  }

  render() {
    const results = this.props.splatnet.current.results.results;
    const data = results.map(result => {
      let power = null;
      if (result.other_estimate_league_point) {
        power = result.other_estimate_league_point;
      } else if (result.other_estimate_fes_power) {
        power = result.other_estimate_fes_power;
      } else if (result.estimate_gachi_power) {
        power = result.estimate_gachi_power;
      }

      const my_count_raw =
        result.my_team_count != null
          ? result.my_team_count
          : result.my_team_percentage;
      const other_count_raw =
        result.other_team_count != null
          ? result.other_team_count
          : result.other_team_percentage;
      const scoreTotal = my_count_raw + other_count_raw;
      const my_count = my_count_raw * 100 / scoreTotal;
      const other_count = other_count_raw * 100 / scoreTotal;
      return {
        bar: 100,
        power,
        lobby: result.game_mode.key,
        result: result.my_team_result.key,
        myScore: my_count,
        otherScore: other_count
      };
    });
    data.reverse();
    const powerAvg = data
      .map(d => d.power)
      .filter(a => a != null)
      .reduce((avg, v, i, a) => avg + v / a.length, 0);
    return (
      <ResponsiveContainer minHeight={200}>
        <ComposedChart
          width={600}
          height={400}
          data={data}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          barGap={0}
          barCategoryGap={-0.5}
        >
          <YAxis
            yAxisId="mode"
            dataKey="bar"
            type="number"
            domain={[0, 100]}
            hide
          />
          <YAxis
            dataKey="power"
            scale="auto"
            type="number"
            domain={['dataMin', 'dataMax']}
          />
          <CartesianGrid stroke="#f5f5f5" />
          <Bar dataKey="bar" yAxisId="mode" isAnimationActive={false}>
            {data.map((entry, index) => {
              const color = this.getModeColor(entry.lobby);
              return <Cell key={index} fill={color} fillOpacity={0.8} />;
            })}
          </Bar>
          <ReferenceLine y={powerAvg} stroke="white" strokeDasharray="3 3" />
          <Line
            type="step"
            dataKey="power"
            stroke="#333"
            isAnimationActive={false}
            dot={<ResultDot />}
          />
        </ComposedChart>
      </ResponsiveContainer>
    );
  }
}

const TimelineSubscribed = () => {
  return (
    <Subscriber channel="splatnet">
      {splatnet => <ResultsTimeline splatnet={splatnet} />}
    </Subscriber>
  );
};

export default TimelineSubscribed;
