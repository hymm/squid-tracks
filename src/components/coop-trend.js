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
  // Area
} from 'recharts';

import { useCoopResults } from '../splatnet-coop-provider';

const stageColors = [
  '#191970',
  '#2c2376',
  '#3a2e7c',
  '#473982',
  '#544488',
  '#604f8e',
  '#6c5a94',
  '#77659a',
  '#8271a0',
  '#8e7da6',
  '#998aab',
  '#a496b2',
  '#afa3b7',
  '#bbafbd',
  '#c6bdc3',
  '#d1c9c9',
  '#ddd6cf',
  '#e8e4d4',
  '#f4f2da',
  '#ffffe0',
];

class ResultDot extends React.Component {
  render() {
    const { payload } = this.props;
    if (payload.result === 'victory') {
      return <Dot {...this.props} fill={'#fff'} fillOpacity={1} />;
    }
    return null;
  }
}

class BarLabel extends React.Component {
  render() {
    const { width, x, y, data, index } = this.props;
    let color = stageColors[data[index].stageId];
    color = color == null ? 'grey' : color;
    if (data[index].stageId === '9999') {
      color = 'ORCHID';
    }

    switch (data[index].rule) {
      case 'turf_war':
        return (
          <g>
            <polygon
              points={`${x},${y} ${x + width * 0.25},${y} ${x},${
                y - width * 0.5
              }`}
              fill={color}
            />
            <polygon
              points={`${x + width * 0.25},${y} ${x + width * 0.5},${
                y - width * 0.5
              } ${x + width * 0.75},${y}`}
              fill={color}
            />
            <polygon
              points={`${x + width * 0.75},${y} ${x + width},${y} ${
                x + width
              },${y - width * 0.5}`}
              fill={color}
            />
          </g>
        );
      case 'splat_zones':
        return (
          <rect {...this.props} y={y - width} height={width} fill={color} />
        );
      case 'tower_control':
        return (
          <polygon
            points={`${x},${y} ${x + width},${y} ${x + width / 2},${y - width}`}
            fill={color}
          />
        );
      case 'rainmaker':
        return (
          <circle
            cx={x + width / 2}
            cy={y - width / 2}
            r={width / 2}
            fill={color}
          />
        );
      case 'clam_blitz':
        const radius = width * 0.9;
        return (
          <path
            d={`M ${x},${y}
              A ${radius} ${radius} 1 0 1 ${x + width} ${y - width}
              A ${radius} ${radius} 1 0 1 ${x} ${y}
              Z`}
            fill={color}
          />
        );
      default:
        return null;
    }
  }
}

class ResultsTimeline extends React.Component {
  getColor(lobby, result) {
    let color = 'grey';
    // const winKey = result === "victory" ? "normal" : "dark";
    // color = LobbyColors[lobby][winKey];
    return color;
  }

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
    const { results, changeResult } = this.props;
    // const results = this.props.splatnet.current.results.results;
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
          <Bar
            dataKey="lobbyBar"
            yAxisId="mode"
            isAnimationActive={false}
            // label={<BarLabel data={data} />}
          >
            {data.map((entry, index) => {
              const color = this.getColor(entry.lobby, entry.result);
              return (
                <Cell
                  key={index}
                  fill={color}
                  fillOpacity={0.8}
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    document.body.scrollTop = 0;
                    changeResult(entry.battle_number);
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
