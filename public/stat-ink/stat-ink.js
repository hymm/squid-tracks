const request2 = require('request-promise-native');
const LobbyModeMap = require('./lobby-mode-map');
const RuleMap = require('./rule-map');
const StageMap = require('./stage-map');
const app = require('electron').app;
const appVersion = app.getVersion();
const appName = app.getName();
const WeaponMap = require('./weapon-map');

/* const request = request2.defaults({
  proxy: 'http://localhost:8888',
  rejectUnauthorized: false,
  jar: true
}); */
const request = request2;

function setUuid(statInk, result) {
  statInk.uuid = result.start_time;
}

function setGameInfo(statInk, result) {
  statInk.lobby = LobbyModeMap[result.game_mode.key].lobby;
  statInk.mode = LobbyModeMap[result.game_mode.key].mode;
  statInk.rule = RuleMap[result.rule.key];
  statInk.stage = StageMap[result.stage.id];
  statInk.start_at = result.start_time;
  // assume if elapsed_time doesn't exist make it 3 minutes for turf war
  const elapsed_time = result.elapsed_time ? result.elapsed_time : 180;
  statInk.end_at = result.start_time + elapsed_time;
}

function setGameResults(statInk, result) {
  statInk.result = result.my_team_result.key === 'victory' ? 'win' : 'lose';
  statInk.knock_out =
    result.my_team_count === 100 || result.their_count === 100 ? 'yes' : 'no';
  // these next parameters depend on turf war vs gachi
  if (result.my_team_percentage) {
    statInk.my_team_percent = result.my_team_percentage;
  }
  if (result.other_team_percentage) {
    statInk.his_team_percent = result.other_team_percentage;
  }
  if (result.my_team_count) {
    statInk.my_team_count = result.my_team_count;
  }
  if (result.other_team_count) {
    statInk.his_team_count = result.other_team_count;
  }
}

function setPlayerResults(statInk, result) {
  statInk.weapon = WeaponMap[result.player_result.player.weapon.id];
  statInk.kill_or_assist = result.player_result.kill_count + result.player_result.assist_count;
  statInk.kill = result.player_result.kill_count ;
  statInk.death = result.player_result.death_count;
  statInk.special = result.player_result.special_count;
  statInk.level = result.player_result.player.player_rank;
  statInk.level_after = result.player_rank;

  if (result.player_result.udemae) {
    statInk.rank = result.player_result.udemae.name.toLowerCase();
  }
  if (result.udemae) {
    statInk.rank_after = result.udemae.name.toLowerCase();
  }

  let paint_point = result.player_result.game_paint_point;
  if (result.rule.key === 'turf_war' && result.my_team_result === 'victory') {
    paint_point += 1000;
  }
  statInk.my_point = paint_point;
}

function getPlayer(playerResult, team) {
  const player = {};
  player.team = team === 'me' ? 'my' : team; // 'my', 'his'
  player.is_me = team === 'me' ? 'yes' : 'no'; // 'yes', 'no'
  player.weapon = WeaponMap[playerResult.player.weapon.id];
  player.level = playerResult.player.player_rank;
  if (playerResult.udemae) {
    player.rank = playerResult.player.udemae.name.toLowerCase();
  }
  player.kill = playerResult.kill_count;
  player.death = playerResult.death_count;
  player.kill_or_assist = playerResult.kill_count + playerResult.assist_count;
  player.special = playerResult.special_count;
  player.point = playerResult.game_paint_point;
  return player;
}

function setPlayers(statInk, result) {
  statInk.players = [];
  statInk.players.push(getPlayer(result.player_result, 'me'));
  result.my_team_members.forEach(player => {
    statInk.players.push(getPlayer(player, 'my'));
  });
  result.other_team_members.forEach(player => {
    statInk.players.push(getPlayer(player, 'his'));
  });
}

function setClientInfo(statInk, result) {
  statInk.automated = 'yes';
  statInk.agent = appName;
  statInk.agent_version = appVersion; // get from json file?
}

function convertResultToStatInk(result) {
  const statInk = {};
  setUuid(statInk, result);
  setGameInfo(statInk, result);
  setGameResults(statInk, result);
  setPlayerResults(statInk, result);
  setPlayers(statInk, result);
  setClientInfo(statInk, result);

  return statInk;
}

async function writeToStatInk(apiKey, result) {
  await request({
    method: 'POST',
    uri: 'https://stat.ink/api/v2/battle',
    headers: {
      Authorization: `Bearer ${apiKey}`
    },
    json: convertResultToStatInk(result)
  });
}

module.exports = writeToStatInk;
