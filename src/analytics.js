import ua from 'universal-analytics';
import uuid from 'uuid/v4';
const { ipcRenderer, remote } = require('electron');
const { app } = remote;
const appVersion = app.getVersion();
const appName = app.getName();

const ua_ID = 'UA-104941988-1';
// get this from saved data or create if it doesn't exist and save it.
let userUuid = ipcRenderer.sendSync('getFromStore', 'uuid');
if (userUuid.length < 10) {
  userUuid = uuid();
  ipcRenderer.sendSync('setToStore', 'uuid', userUuid);
}
const visitor = ua(ua_ID, userUuid);

// support disabling analytics
export const screenview = screenName => {
  if (ipcRenderer.sendSync('getFromStore', 'gaEnabled')) {
    visitor.screenview(screenName, appName, appVersion).send();
  }
};

export const event = (...args) => {
  if (ipcRenderer.sendSync('getFromStore', 'gaEnabled')) {
    visitor.event(...args).send();
  }
};

export const uaException = (exd, ...args) => {
  if (ipcRenderer.sendSync('getFromStore', 'gaEnabled')) {
    visitor.exception({ exd, av: appVersion, ...args }).send();
  }
};
