import React from 'react';
import { Subscriber } from 'react-broadcast';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
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
        power
      };
    });
    return (
      <ResponsiveContainer>
        <ComposedChart
          width={'100%'}
          height={'100%'}
          data={data.reverse()}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <YAxis
            dataKey="power"
            scale="auto"
            type="number"
            domain={['dataMin', 'dataMax']}
          />
          <CartesianGrid stroke="#f5f5f5" />
          <Line type="monotone" dataKey="power" stroke="#888" />
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
