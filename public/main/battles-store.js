const { ipcMain } = require('electron');
const Store = require('./store');

const battleStore = new Store({
  configName: 'battles',
  defaults: {}
});

ipcMain.on('setBattleToStore', (event, battle) => {
  battleStore.set(battle.battle_number, battle);
  event.returnValue = true;
});

ipcMain.on('getBattleFromStore', (event, number) => {
  const battle = battleStore.get(number);
  if (battle == null) {
    event.returnValue = null;
    return;
  }
  event.returnValue = battle;
});
