import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  Legend,
  PolarAngleAxis /* PolarRadiusAxis */,
} from 'recharts';

const dataTypes = [
  { stat: 'Assists', key: 'a', fullMark: 20 },
  { stat: 'Specials', key: 's', fullMark: 10 },
  { stat: 'Paint', key: 'p', fullMark: 2500 },
  { stat: 'Deaths', key: 'd', fullMark: 20 },
  { stat: 'Kills', key: 'k', fullMark: 20 },
];

const colors = [['#C83D79', '#CF581B', 'darkblue', 'green'], []];

function normalize(team, maximums) {
  const keys = dataTypes.map((type) => type.key);
  const normalized = team.map((player) => {
    const tempObj = {};
    keys.forEach((key) => {
      tempObj[key] = player[key] / maximums[key];
    });
    return tempObj;
  });

  return normalized;
}

const RadarTeam = ({ team, maximums }) => {
  const mappedTeam = team.map((player) => {
    return {
      k: player.kill_count,
      a: player.assist_count,
      d: player.death_count,
      s: player.special_count,
      p: player.game_paint_point,
    };
  });
  const normalized = normalize(mappedTeam, maximums);
  const data = dataTypes.map((row) => {
    team.forEach((player, index) => {
      row[player.player.principal_id] = normalized[index][row.key];
      row.statMax = `${row.stat} (${maximums[row.key]})`;
    });
    return row;
  });
  return (
    <RadarChart
      cx={180}
      cy={130}
      outerRadius={100}
      width={360}
      height={280}
      data={data}
      startAngle={90}
      endAngle={-270}
    >
      {team.map((player, index) => (
        <Radar
          name={
            player.game_paint_point === 0 ? (
              <strike>{player.player.nickname}</strike>
            ) : (
              player.player.nickname
            )
          }
          dataKey={player.player.principal_id}
          stroke={colors[0][index]}
          fill={colors[0][index]}
          fillOpacity={0.1}
        />
      ))}
      <PolarGrid />
      <Legend />
      <PolarAngleAxis dataKey="statMax" />
    </RadarChart>
  );
};

export default RadarTeam;
