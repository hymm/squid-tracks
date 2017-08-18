import ua from 'universal-analytics';
import uuid from 'uuid/v4';
const { ipcRenderer, remote } = window.require('electron');
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
const analyticsEnabled = true;
export const screenview = (screenName) => {
    if (analyticsEnabled) {
        visitor.screenview(screenName, appName, appVersion).send();
    }
};
