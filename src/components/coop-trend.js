import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  Cell,
  YAxis,
  CartesianGrid,
  ReferenceLine,
  Dot,
} from 'recharts';

import { useCoopResults } from '../splatnet-coop-provider';

class ResultDot extends React.Component {
  render() {
    const { payload } = this.props;
    if (payload.result === 'victory') {
      return <Dot {...this.props} fill={'#fff'} fillOpacity={1} />;
    }
    return null;
  }
}

class ResultsTimeline extends React.Component {
  getValues(result) {
    let lobbyBar = 0;
    if (result.job_result.is_clear) {
      lobbyBar = 100;
    } else {
      lobbyBar = 33.3 * (result.job_result.failure_wave - 1);
    }
    return {
      lobbyBar: lobbyBar,
      grade: result.grade.id,
      grade_point: result.grade_point,
      job_rate: result.job_rate,
      job_score: result.job_score,
      danger_rate: result.danger_rate,
    };
  }

  renderPowerTrend(average) {
    return [
      <YAxis
        key="powerYAxis"
        dataKey="danger_rate"
        scale="auto"
        type="number"
        domain={[`dataMin - 50`, `dataMax + 50`]}
        allowDecimals={false}
      />,
      <Line
        key="powerTrend"
        type="step"
        dataKey="danger_rate"
        stroke="#333"
        isAnimationActive={true}
        dot={<ResultDot />}
      />,
      <ReferenceLine
        key="powerAverage"
        y={average}
        stroke="white"
        strokeOpacity={0.5}
      />,
    ];
  }

  render() {
    const { results } = this.props;
    const data = results.map((result) => this.getValues(result));

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
            dataKey="lobbyBar"
            type="number"
            domain={[0, 100]}
            hide
          />
          <CartesianGrid stroke="#f5f5f5" />
          <Bar dataKey="lobbyBar" yAxisId="mode" isAnimationActive={false}>
            {data.map((entry, index) => {
              return (
                <Cell
                  key={index}
                  fill="#ff5600"
                  fillOpacity={0.8}
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    document.body.scrollTop = 0;
                    // TODO: implement and pass changeResult prop
                    // changeResult(entry.battle_number);
                  }}
                />
              );
            })}
          </Bar>
          {this.renderPowerTrend(0)}
        </ComposedChart>
      </ResponsiveContainer>
    );
  }
}

const TimelineSubscribed = ({ ...props }) => {
  const [coopResults] = useCoopResults();

  return <ResultsTimeline results={coopResults.results} {...props} />;
};

export default TimelineSubscribed;
