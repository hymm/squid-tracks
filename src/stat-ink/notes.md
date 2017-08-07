# Notes on stat.ink
API spec.  Should keep an eye on this as there should be additions in the future
https://github.com/fetus-hina/stat.ink/blob/master/doc/api-2/post-battle.md

used parameters
```js
{
  uuid // should be unique to battle, can we use result.start_time?

  // game info
  lobby // standard, squad_2, squad_4, private
  mode // regular, gachi, fest, private
  rule // nawabari, area, yagura, hoko
  stage // see stage-map.js, result.stage.id
  start_at //result.start_time
  end_at // add duration to start_time ? result.elapsed_time (seconds)

  // game results
  result // result.my_team_result.key, 'win' or 'lose'
  knock_out // my_team_result.key, use my_team_count == 100 or their_count == 100, 'yes' or 'no'
  my_team_percent // score in turf result.my_team_percentage
  his_team_percent // score in turf result.other_team_percentage
  my_team_count // score in ranked result.my_team_count
  his_team_count // score in ranked result.other_team_count

  // player results
  weapon // see weapon-map.js, result.player_result.player.weapon.id
  kill // result.player_result.kill_count - result.player_result.assist_count
  death // result.player_result.death_count
  kill_or_assist // result.player_result.kill_count
  special // result.player_result.special_count
  level // result.player_result.player.player_rank
  level_after // result.player_rank
  rank // result.player_result.player.player_rank
  rank_after // result.player_result.udemae.name, needs to be lower case?
  my_point // paint points result.player_result.game_paint_point + add winning bonus

  // team results
  players // this is complicated, see code

  // client info
  automated // automated posting or manual, will be automated
  agent // up to 64 characters, agent name "SplatStats"
  agent_version // client determined, up to 255 characters
  agent_custom // client use, stat.ink doesn't care
  agent_variables // key value of client defnition, shown in addition information.  Should experiment with these
}
```

Stuff I haven't figured out.

* there's a link to agent page on stat.ink.  Not sure how to set

Unused battle api params
```js
// unused by this program
players[].my_kill
rank_in_team  // 1 to 4, seems to be all zeros
note // notes for battle, maybe use for tournaments?
max_kill_combo // don't think this is available in splatnet
max_kill_streak // don't think this is available in splatnet
my_team_point // paint points, doesn't seem to exist in splatnet data
his_team_point // paint points, doesn't seem to exist in splatnet data
private_note // note that is only displayed to user
link_url // link related to battle? there's a link to user agent site is this it?
image_judge // png/jpeg screenshot of judge screen
image_result // screenshot of result screen
image_gear // screenshot of gear config
death_reasons // can't do these, ikalog reads screen notification for thses
events // can't do these, ikalog makes events like when the RM is picked up
```
