import { mapKeys, mapValues, isObject } from 'lodash';

const generalFields = [
  'battle_number',
  'elapsed_time',
  'other_team_count',
  'my_team_count',
  'other_team_percentage',
  'my_team_percentage',
  'start_time',
  'my_team_result.key',
  'other_team_result.key',
  'stage.name',
  'stage.id',
  'game_mode.key',
  'rule.key',
];

export function getGeneralFields() {
  return generalFields;
}

const playerFields = [
  'kill_count',
  'assist_count',
  'death_count',
  'special_count',
  'game_paint_point',
  'player.nickname',
  'player.principal_id',
  'player.weapon.id',
  // '.player.head.id',
  // '.player.shoes.id',
  // '.player.clothes.id',
  // '.player.head_skills.main.id',
  // '.player.head_skills.subs[0].id',
  // '.player.head_skills.subs[1].id',
  // '.player.head_skills.subs[2].id',
  // '.player.clothes_skills.main.id',
  // '.player.clothes_skills.subs[0].id',
  // '.player.clothes_skills.subs[1].id',
  // '.player.clothes_skills.subs[2].id',
  // '.player.shoe_skills.main.id',
  // '.player.shoe_skills.sub[0].id',
  // '.player.shoe_skills.sub[1].id',
  // '.player.shoe_skills.sub[2].id',
];

export function getPlayerFields() {
  return playerFields;
}

export function mapKeysDeep(obj, cb) {
  return mapValues(mapKeys(obj, cb), (val) =>
    isObject(val) ? mapKeysDeep(val, cb) : val
  );
}
