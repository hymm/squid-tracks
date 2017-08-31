import React from 'react';
import {Radar, RadarChart, PolarGrid, Legend,
         PolarAngleAxis, /* PolarRadiusAxis */ } from 'recharts';

const dataTypes = [
    { stat: 'Assists', key: 'a', fullMark: 20 },
    { stat: 'Specials', key: 's', fullMark: 10 },
    { stat: 'Paint', key: 'p', fullMark: 2500 },
    { stat: 'Deaths', key: 'd', fullMark: 20 },
    { stat: 'Kills', key: 'k', fullMark: 20 },
    { stat: 'Score', key: 'c', fullMark: 100 },
];

function getTotal(team) {
    const k = team.reduce((sum, player) => sum + player.kill_count, 0);
    const a = team.reduce((sum, player) => sum + player.assist_count, 0);
    const d = team.reduce((sum, player) => sum + player.death_count, 0);
    const s = team.reduce((sum, player) => sum + player.special_count, 0);
    const p = team.reduce((sum, player) => sum + player.game_paint_point, 0);

    return { k, a, d, s, p }
}

function getMaximums(myTeam, otherTeam) {
    const keys = dataTypes.map((type) => type.key);
    const maximums = {};

    keys.forEach(key =>
        maximums[key] = myTeam[key] > otherTeam[key] ? myTeam[key] : otherTeam[key]
    );

    return maximums;
}

function normalize(team, maximums) {
    const keys = dataTypes.map((type) => type.key);
    const normalized = {}
    keys.forEach(key => {
        normalized[key] = team[key] / maximums[key]
    });

    return normalized;
}

const RadarTotalsChart = ({ myTeam, otherTeam, myCount, otherCount }) => {
    const myTeamTotals = getTotal(myTeam);
    const otherTeamTotals = getTotal(otherTeam);
    myTeamTotals.c = myCount;
    otherTeamTotals.c = otherCount;
    const maximums = getMaximums(myTeamTotals, otherTeamTotals);
    const myTeamNormalized = normalize(myTeamTotals, maximums);
    const otherTeamNormalized = normalize(otherTeamTotals, maximums);

    const data = dataTypes.map((row) => {
        row.myTeam = myTeamNormalized[row.key];
        row.otherTeam = otherTeamNormalized[row.key];
        row.fullMark = 1;
        row.maximum = maximums[row.key];
        return row;
    });

    return (
        <RadarChart cx={160} cy={130} outerRadius={100} width={320} height={280} data={data} startAngle={90} endAngle={-270}>
          <Radar name="My Team" dataKey="myTeam" stroke="#C83D79" fill="#C83D79" fillOpacity={0.4} />
          <Radar name="Enemy Team" dataKey="otherTeam" stroke="#409D3B" fill="#409D3B" fillOpacity={0.6} />
          <PolarGrid />
          <Legend />
          <PolarAngleAxis dataKey="stat" />
        </RadarChart>
    );
}

export default RadarTotalsChart;
