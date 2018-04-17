import React from 'react';
import LobbyColors from './lobby-colors';
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
  Dot,
  Area
} from 'recharts';
import { getValue } from './sort-array';

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
  '#ffffe0'
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
              points={`${x},${y} ${x + width * 0.25},${y} ${x},${y -
                width * 0.5}`}
              fill={color}
            />
            <polygon
              points={`${x + width * 0.25},${y} ${x + width * 0.5},${y -
                width * 0.5} ${x + width * 0.75},${y}`}
              fill={color}
            />
            <polygon
              points={`${x + width * 0.75},${y} ${x + width},${y} ${x +
                width},${y - width * 0.5}`}
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
  getModeColor(lobby, result) {
    let color = 'grey';
    const winKey = result === 'victory' ? 'normal' : 'dark';
    color = LobbyColors[lobby][winKey];
    return color;
  }

  selectCount(team_count, team_percentage) {
    return team_count != null ? team_count : team_percentage;
  }

  getCounts(result) {
    const my_count_raw = this.selectCount(
      result.my_team_count,
      result.my_team_percentage
    );
    const other_count_raw = this.selectCount(
      result.other_team_count,
      result.other_team_percentage
    );
    const total = my_count_raw + other_count_raw;
    const mine = my_count_raw * 100 / total;
    const other = other_count_raw * 100 / total;

    return {
      mine,
      other
    };
  }

  getPower(result) {
    let power = null;
    if (result.other_estimate_league_point) {
      power = result.other_estimate_league_point;
    } else if (result.other_estimate_fes_power) {
      power = result.other_estimate_fes_power;
    } else if (result.estimate_gachi_power) {
      power = result.estimate_gachi_power;
    }

    return power;
  }

  getValues(result) {
    const power = this.getPower(result);
    const counts = this.getCounts(result);

    const a = getValue(result, 'player_result.assist_count');
    const k = getValue(result, 'player_result.kill_count');

    return {
      a,
      k,
      ka: k + a,
      d: getValue(result, 'player_result.death_count'),
      s: getValue(result, 'player_result.special_count'),
      lobbyBar: 100,
      inked: getValue(result, 'player_result.game_paint_point'),
      power,
      rule: result.rule.key,
      lobby: result.game_mode.key,
      result: result.my_team_result.key,
      stageId: result.stage.id,
      myScore: counts.mine,
      otherScore: counts.other,
      battle_number: result.battle_number
    };
  }

  renderPowerTrend(average) {
    return [
      <YAxis
        key="powerYAxis"
        dataKey="power"
        scale="auto"
        type="number"
        domain={[`dataMin - 50`, `dataMax + 50`]}
        allowDecimals={false}
      />,
      <Line
        key="powerTrend"
        type="step"
        dataKey="power"
        stroke="#333"
        isAnimationActive={true}
        dot={<ResultDot />}
      />,
      <ReferenceLine
        key="powerAverage"
        y={average}
        stroke="white"
        strokeOpacity={0.5}
      />
    ];
  }

  renderInkedTrend(average) {
    return [
      <YAxis
        key="inkedYAxis"
        dataKey="inked"
        scale="auto"
        type="number"
        domain={[0, `dataMax + 50`]}
        tickFormatter={valueRaw => valueRaw.toFixed(0)}
      />,
      <Line
        key="inkedTrend"
        type="step"
        dataKey="inked"
        stroke="#333"
        isAnimationActive={true}
        dot={<ResultDot />}
      />,
      <ReferenceLine
        key="inkedAverage"
        y={average}
        stroke="white"
        strokeOpacity={0.5}
      />
    ];
  }

  renderKillsAndAssistsTrend(averageK, averageA) {
    return [
      <YAxis
        key="kaYAxis"
        dataKey="ka"
        scale="auto"
        type="number"
        domain={[0, `dataMax + 1`]}
        tickFormatter={valueRaw => valueRaw.toFixed(0)}
      />,
      <ReferenceLine
        key="kaAverage"
        y={(parseFloat(averageK) + parseFloat(averageA)).toFixed(2)}
        stroke="white"
      />,
      <Area
        key="kaTrend"
        dataKey="ka"
        type="step"
        stroke="#333"
        fill="lightgrey"
        fillOpacity={1}
        isAnimationActive={true}
        dot={<ResultDot />}
      />,
      <ReferenceLine key="aAverage" y={averageA} stroke="grey" />,
      <Area
        key="aTrend"
        dataKey="a"
        type="step"
        stroke="#000"
        fill="grey"
        fillOpacity={1}
        isAnimationActive={true}
        dot={null}
      />
    ];
  }

  renderKillsAndDeathsTrend(averageK, averageD) {
    return [
      <YAxis
        key="kdYAxis"
        dataKey="k"
        scale="auto"
        type="number"
        domain={[0, `dataMax + 1`]}
        tickFormatter={valueRaw => valueRaw.toFixed(0)}
      />,
      <ReferenceLine key="kAverage" y={averageK} stroke="white" />,
      <Line
        key="kTrend"
        dataKey="k"
        type="step"
        stroke="#fff"
        isAnimationActive={true}
        dot={<ResultDot />}
      />,
      <ReferenceLine key="dAverage" y={averageD} stroke="grey" />,
      <Line
        key="dTrend"
        dataKey="d"
        type="step"
        stroke="#000"
        isAnimationActive={true}
        dot={null}
      />
    ];
  }

  renderSpecialsTrend(average) {
    return [
      <YAxis
        key="sYAxis"
        dataKey="s"
        scale="auto"
        type="number"
        domain={[0, `dataMax + 1`]}
        tickFormatter={valueRaw => valueRaw.toFixed(0)}
      />,
      <Line
        key="sTrend"
        type="step"
        dataKey="s"
        stroke="#333"
        isAnimationActive={true}
        dot={<ResultDot />}
      />,
      <ReferenceLine
        key="sAverage"
        y={average}
        stroke="white"
        strokeOpacity={0.5}
      />
    ];
  }

  render() {
    const { activeValue, averages, results, changeResult } = this.props;
    // const results = this.props.splatnet.current.results.results;
    const data = results.map(result => this.getValues(result));

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
            label={<BarLabel data={data} />}
          >
            {data.map((entry, index) => {
              const color = this.getModeColor(entry.lobby, entry.result);
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
          {activeValue === 'power' ? this.renderPowerTrend(powerAvg) : null}
          {activeValue === 'inked' ? this.renderInkedTrend(averages.p) : null}
          {activeValue === 'killsAndAssists'
            ? this.renderKillsAndAssistsTrend(averages.k, averages.a)
            : null}
          {activeValue === 'killsAndDeaths'
            ? this.renderKillsAndDeathsTrend(averages.k, averages.d)
            : null}
          {activeValue === 'specials'
            ? this.renderSpecialsTrend(averages.s)
            : null}
        </ComposedChart>
      </ResponsiveContainer>
    );
  }
}

const TimelineSubscribed = ({ ...props }) => {
  return (
    <Subscriber channel="splatnet">
      {splatnet => <ResultsTimeline splatnet={splatnet} {...props} />}
    </Subscriber>
  );
};

export default TimelineSubscribed;
