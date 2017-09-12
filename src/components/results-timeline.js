import React from 'react';
import { Subscriber } from 'react-broadcast';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  ReferenceArea,
  YAxis,
  CartesianGrid
} from 'recharts';

class ResultsTimeline extends React.Component {
  render() {
    const results = this.props.splatnet.current.results.results;
    const data = results.map(result => {
      let power = undefined;
      if (result.other_estimate_league_point) {
        power = result.other_estimate_league_point;
      } else if (result.other_estimate_fes_power) {
        power = result.other_estimate_fes_power;
      } else if (result.estimate_gachi_power) {
        power = result.estimate_gachi_power;
      }

      return {
        power,
        lobby: result.game_mode.key
      };
    });
    data.reverse();
    const modes = data.map(({ lobby }, i) => {
      let color = 'grey';
      switch (lobby) {
        case 'regular':
          color = 'lightgreen';
          break;
        case 'gachi':
          color = 'orange';
          break;
        case 'league_pair':
          color = 'hotpink';
          break;
        case 'league_team':
          color = 'hotpink';
          break;
        case 'private':
          color = 'purple';
          break;
        default:
          color = 'lightgrey';
      }
      return <ReferenceArea x1={i} x2={i + 1} fill={color} fillOpacity={0.3} />;
    });
    return (
      <ResponsiveContainer minHeight={200}>
        <ComposedChart
          width={600}
          height={400}
          data={data}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <YAxis
            dataKey="power"
            scale="auto"
            type="number"
            domain={['dataMin', 'dataMax']}
          />
          <CartesianGrid stroke="#f5f5f5" />
          <Line type="step" dataKey="power" stroke="#333" />
          {modes}
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
