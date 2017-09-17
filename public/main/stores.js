const Store = require('./store');

const userDataStore = new Store({
  configName: 'user-data',
  defaults: {
    sessionToken: '',
    iksmCookie: '',
    statInkToken: '',
    statInkInfo: {},
    uuid: '',
    gaEnabled: true,
    locale: '',
    combineReplicaLeagueStats: false
  }
});
module.exports.userDataStore = userDataStore;
