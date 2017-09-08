const { ipcMain } = require('electron');
const Store = require('./store');

const battleStore = new Store({
  configName: 'battles',
  defaults: {
    battles: {}
  }
});

ipcMain.on('setBattleToStore', (event, battle) => {
  const battles = battleStore.get('battles');
  battles[battle.battle_number] = battle;
  battleStore.set('battles', battles);
  event.returnValue = true;
});

ipcMain.on('getBattlesFromStore', event => {
  event.returnValue = battleStore.get('battles');
});
