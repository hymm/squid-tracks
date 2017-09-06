const ua = require('universal-analytics');
const uuid = require('uuid/v4');
const { app } = require('electron');
const appVersion = app.getVersion();
const appName = app.getName();
const Store = require('./store');

const store = new Store({
  configName: 'user-data',
  defaults: {
    uuid: '',
    gaEnabled: true,
  }
});

const ua_ID = 'UA-104941988-1';
// get this from saved data or create if it doesn't exist and save it.
let userUuid = store.get('uuid');
if (userUuid.length < 10) {
  userUuid = uuid();
  store.set('uuid', userUuid);
}
const visitor = ua(ua_ID, userUuid);

// support disabling analytics
const screenview = screenName => {
  if (store.get('gaEnabled')) {
    visitor.screenview(screenName, appName, appVersion).send();
  }
};
module.exports.screenView = screenview;

const event = (...args) => {
  if (store.get('gaEnabled')) {
    visitor.event(...args).send();
  }
};
module.exports.event = event;

const uaException = (...args) => {
  if (store.get('gaEnabled')) {
      visitor.exception(...args).send();
  }
}
module.exports.uaException = uaException;
