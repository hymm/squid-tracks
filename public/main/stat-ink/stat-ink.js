const request2 = require('request-promise-native');
const msgpack = require('msgpack-lite');
const LobbyModeMap = require('./lobby-mode-map');
const RuleMap = require('./rule-map');
const StatInkMap = require('./stat-ink-map');
const AbilityMap = require('./ability-map');
const defaultStageMap = require('./default-maps/stage.json');
const defaultWeaponMap = require('./default-maps/weapon.json');
const defaultHeadMap = require('./default-maps/head.json');
const defaultShirtMap = require('./default-maps/shirt.json');
const defaultShoesMap = require('./default-maps/shoes.json');
const { getSplatnetImage } = require('../splatnet2');
const log = require('electron-log');
const app = require('electron').app;
const appVersion = app.getVersion();
const appName = app.getName();
const FestRankMap = require('./fest-rank-map');

let request;
if (process.env.PROXY) {
  request = request2.defaults({
    proxy: 'http://localhost:8888',
    rejectUnauthorized: false,
    jar: true
  });
} else {
  request = request2;
}

function setUuid(statInk, result) {
  statInk.uuid = result.start_time;
}

const stageMap = new StatInkMap(
  'stage.json',
  'https://stat.ink/api/v2/stage',
  defaultStageMap
);

const weaponMap = new StatInkMap(
  'weapon.json',
  'https://stat.ink/api/v2/weapon',
  defaultWeaponMap
);

const headMap = new StatInkMap(
  'head.json',
  'https://stat.ink/api/v2/gear?type=headgear',
  defaultHeadMap
);

const shirtMap = new StatInkMap(
  'shirt.json',
  'https://stat.ink/api/v2/gear?type=clothing',
  defaultShirtMap
);

const shoesMap = new StatInkMap(
  'shoes.json',
  'https://stat.ink/api/v2/gear?type=shoes',
  defaultShoesMap
);

async function setGameInfo(statInk, result) {
  statInk.lobby = LobbyModeMap[result.game_mode.key].lobby;
  statInk.mode = LobbyModeMap[result.game_mode.key].mode;
  statInk.rule = RuleMap[result.rule.key];
  try {
    statInk.stage = await stageMap.getKey(result.stage.id);
  } catch (e) {
    log.error(e);
  }
  statInk.start_at = result.start_time;
  // assume if elapsed_time doesn't exist make it 3 minutes for turf war
  const elapsed_time = result.elapsed_time ? result.elapsed_time : 180;
  statInk.end_at = result.start_time + elapsed_time;
  statInk.splatnet_number = result.battle_number;
  if (result.tag_id) {
    statInk.my_team_id = result.tag_id;
  }
}

async function setPowerInfo(statInk, result) {
  if (result.estimate_gachi_power != null) {
    statInk.estimate_gachi_power = result.estimate_gachi_power;
  }
  if (result.league_point != null) {
    statInk.league_point = result.league_point;
  }
  if (result.my_estimate_league_point != null) {
    statInk.my_team_estimate_league_point = result.my_estimate_league_point;
  }
  if (result.other_estimate_league_point != null) {
    statInk.his_team_estimate_league_point = result.other_estimate_league_point;
  }
  if (result.fes_power != null) {
    statInk.fest_power = result.fes_power;
  }
  if (result.my_estimate_fes_power != null) {
    statInk.my_team_estimate_fes_power = result.my_estimate_fes_power;
  }
  if (result.other_estimate_fes_power != null) {
    statInk.other_team_estimate_fes_power = result.other_estimate_fes_power;
  }
  if (result.x_power != null) {
    statInk.x_power_after = result.x_power;
  }
  if (result.estimate_x_power != null) {
    statInk.estimate_gachi_power = result.estimate_x_power;
  }
}

function setGameResults(statInk, result) {
  statInk.result = result.my_team_result.key === 'victory' ? 'win' : 'lose';
  statInk.knock_out =
    result.my_team_count === 100 || result.other_team_count === 100
      ? 'yes'
      : 'no';
  // these next parameters depend on turf war vs gachi
  if (result.my_team_percentage != null) {
    statInk.my_team_percent = result.my_team_percentage;
  }
  if (result.other_team_percentage != null) {
    statInk.his_team_percent = result.other_team_percentage;
  }
  if (result.my_team_count != null) {
    statInk.my_team_count = result.my_team_count;
  }
  if (result.other_team_count != null) {
    statInk.his_team_count = result.other_team_count;
  }
}

async function setPlayerResults(statInk, result) {
  try {
    statInk.weapon = await weaponMap.getKey(
      result.player_result.player.weapon.id
    );
  } catch (e) {
    log.error(e);
  }

  statInk.kill_or_assist =
    result.player_result.kill_count + result.player_result.assist_count;
  statInk.kill = result.player_result.kill_count;
  statInk.death = result.player_result.death_count;
  statInk.special = result.player_result.special_count;
  statInk.level = result.player_result.player.player_rank;
  statInk.level_after = result.player_rank;
  if (result.star_rank != null) {
    statInk.star_rank = result.star_rank;
  }

  if (result.player_result.player.udemae) {
    if (result.player_result.player.udemae.name) {
      statInk.rank = result.player_result.player.udemae.name.toLowerCase();
    }
    if (result.player_result.player.udemae.s_plus_number != null) {
      statInk.rank_exp = result.player_result.player.udemae.s_plus_number;
    }
  }
  if (result.udemae) {
    if (result.udemae.name) {
      statInk.rank_after = result.udemae.name.toLowerCase();
    }

    if (result.udemae.s_plus_number != null) {
      statInk.rank_exp_after = result.player_result.player.udemae.s_plus_number;
    }
  }

  let paint_point = result.player_result.game_paint_point;
  if (
    result.my_team_result.key === 'victory' &&
    result.rule.key === 'turf_war'
  ) {
    paint_point += 1000;
  }
  statInk.my_point = paint_point;
}

async function getPlayer(playerResult, team, addBonus) {
  const player = {};
  player.team = team === 'me' ? 'my' : team; // 'my', 'his'
  player.is_me = team === 'me' ? 'yes' : 'no'; // 'yes', 'no'
  player.name = playerResult.player.nickname;
  try {
    player.weapon = await weaponMap.getKey(playerResult.player.weapon.id);
  } catch (e) {
    log.error(e);
  }
  player.level = playerResult.player.player_rank;
  player.star_rank = playerResult.player.star_rank;
  if (playerResult.player.udemae) {
    if (playerResult.player.udemae.name) {
      player.rank = playerResult.player.udemae.name.toLowerCase();
    }
    if (playerResult.player.udemae.s_plus_number != null) {
      player.rank_exp = playerResult.player.udemae.s_plus_number;
    }
  }
  player.kill = playerResult.kill_count;
  player.death = playerResult.death_count;
  player.kill_or_assist = playerResult.kill_count + playerResult.assist_count;
  player.special = playerResult.special_count;
  player.point = playerResult.game_paint_point;
  if (addBonus) {
    player.point += 1000;
  }
  player.splatnet_id = playerResult.player.principal_id;
  return player;
}

async function setPlayers(statInk, result) {
  statInk.players = [];
  const addBonusMyTeam =
    result.my_team_result.key === 'victory' && result.rule.key === 'turf_war';
  statInk.players.push(
    await getPlayer(result.player_result, 'me', addBonusMyTeam)
  );
  result.my_team_members.forEach(async player => {
    statInk.players.push(await getPlayer(player, 'my', addBonusMyTeam));
  });

  const addBonusTheirTeam =
    result.other_team_result.key === 'victory' &&
    result.rule.key === 'turf_war';
  result.other_team_members.forEach(async player => {
    statInk.players.push(await getPlayer(player, 'his', addBonusTheirTeam));
  });
}

function setClientInfo(statInk, result) {
  statInk.automated = 'yes';
  statInk.agent = appName;
  statInk.agent_version = appVersion; // get from json file?
}

function setSplatFest(statInk, result) {
  statInk.fest_title = FestRankMap[result.player_result.player.fes_grade.rank];
  statInk.fest_title_after = FestRankMap[result.fes_grade.rank];
}

async function setGear(statInkGear, gearId, abilities, gearMap) {
  try {
    statInkGear.gear = await gearMap.getKey(gearId);
  } catch (e) {
    log.error(e);
  }

  statInkGear.primary_ability = AbilityMap[abilities.main.id];
  statInkGear.secondary_abilities = [];
  for (const sub of abilities.subs) {
    statInkGear.secondary_abilities.push(
      sub == null ? null : AbilityMap[sub.id]
    );
  }
}

async function setPlayerGear(statInk, result) {
  statInk.gears = { headgear: {}, clothing: {}, shoes: {} };
  const player = result.player_result.player;
  setGear(statInk.gears.headgear, player.head.id, player.head_skills, headMap);
  setGear(
    statInk.gears.clothing,
    player.clothes.id,
    player.clothes_skills,
    shirtMap
  );
  setGear(statInk.gears.shoes, player.shoes.id, player.shoes_skills, shoesMap);
}

async function convertResultToStatInk(result, disableGetImage) {
  const statInk = {};
  setUuid(statInk, result);
  await setGameInfo(statInk, result);
  setPowerInfo(statInk, result);
  setGameResults(statInk, result);

  await setPlayerResults(statInk, result);
  await setPlayerGear(statInk, result);
  await setPlayers(statInk, result);
  setClientInfo(statInk, result);

  if (result.game_mode.key === 'fest') {
    setSplatFest(statInk, result);
  }

  if (!disableGetImage) {
    statInk.image_result = await getSplatnetImage(result.battle_number);
  }

  statInk.splatnet_json = result;

  return statInk;
}
module.exports.convertResultToStatInk = convertResultToStatInk;

async function writeToStatInk(apiKey, result) {
  const response = await request({
    method: 'POST',
    uri: 'https://stat.ink/api/v2/battle',
    headers: {
      'Content-Type': 'application/x-msgpack',
      Authorization: `Bearer ${apiKey}`
    },
    body: msgpack.encode(await convertResultToStatInk(result)),
    resolveWithFullResponse: true,
    simple: false
  });

  if (response.statusCode !== 201 && response.statusCode !== 302) {
    throw new Error(`${response.statusCode} - ${response.body}`);
  }

  return {
    username: response.headers['x-user-screen-name'],
    battle: response.headers['x-battle-id'],
    location: response.headers['location'],
    apiLocation: response.headers['x-api-location']
  };
}
module.exports.writeToStatInk = writeToStatInk;
