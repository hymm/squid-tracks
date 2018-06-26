import ua from 'universal-analytics';
import uuid from 'uuid/v4';
const { ipcRenderer, remote } = require('electron');
const { app } = remote;
const appVersion = app.getVersion();
const appName = app.getName();
const log = require('electron-log');

const ua_ID = 'UA-104941988-1';
// get this from saved data or create if it doesn't exist and save it.
let userUuid = ipcRenderer.sendSync('getFromStore', 'uuid');
if (userUuid.length < 10) {
  userUuid = uuid();
  ipcRenderer.sendSync('setToStore', 'uuid', userUuid);
}
const visitor = ua(ua_ID, userUuid);

function errorHandler(err) {
  if (err) {
    log.error(`Error with google analytics: ${err}`);
  }
}

// support disabling analytics
export const screenview = screenName => {
  if (ipcRenderer.sendSync('getFromStore', 'gaEnabled')) {
    visitor.screenview(screenName, appName, appVersion, errorHandler).send();
  }
};

export const event = (...args) => {
  if (ipcRenderer.sendSync('getFromStore', 'gaEnabled')) {
    visitor.event(...args, errorHandler).send();
  }
};

export const uaException = (exd, ...args) => {
  if (ipcRenderer.sendSync('getFromStore', 'gaEnabled')) {
    visitor.exception({ exd, av: appVersion, ...args }, errorHandler).send();
  }
};
