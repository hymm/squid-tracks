const ua = require('universal-analytics');
const { v4: uuid } = require('uuid');
const { app } = require('electron');
const appVersion = app.getVersion();
const appName = app.getName();
const Store = require('./store');
const log = require('electron-log');

const store = new Store({
  configName: 'user-data',
  defaults: {
    uuid: '',
    gaEnabled: true,
  },
});

const ua_ID = 'UA-104941988-1';
// get this from saved data or create if it doesn't exist and save it.
let userUuid = store.get('uuid');
if (userUuid.length < 10) {
  userUuid = uuid();
  store.set('uuid', userUuid);
}
const visitor = ua(ua_ID, userUuid);

function errorHandler(err) {
  if (err) {
    log.error(`Error with google analytics: ${err}`);
  }
}

// support disabling analytics
const screenview = (screenName) => {
  if (store.get('gaEnabled')) {
    visitor.screenview(screenName, appName, appVersion, errorHandler);
  }
};
module.exports.screenView = screenview;

const event = (...args) => {
  if (store.get('gaEnabled')) {
    visitor.event(...args, errorHandler);
  }
};
module.exports.event = event;

const uaException = (exd, ...args) => {
  if (store.get('gaEnabled')) {
    visitor.exception({ exd, av: appVersion }, ...args, errorHandler);
  }
};
module.exports.uaException = uaException;
