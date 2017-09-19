const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const path = require('path');
const log = require('electron-log');
const isDev = require('electron-is-dev');
const fs = require('fs');
const eSplatnet = require('./electron-splatnet');
const { userDataStore } = require('./stores');
const splatnet = require('./splatnet2');

const { writeToStatInk } = require('./stat-ink/stat-ink');
const { uaException } = require('./analytics');

const Store = require('./store');
require('./battles-store');
const mitm = require('./mitm-read-cookie');

process.on('uncaughtException', err => {
  const message = `Unhandled Error in Main: ${err}`;
  log.error(message);
  uaException(message);
});

process.on('unhandledRejection', err => {
  const message = `Unhandled Promise Rejection in Main: ${err}`;
  log.error(message);
  uaException(message);
});

if (!isDev) {
  require('./autoupdate');
} else {
  log.info('app running in development');
}

const startUrl = isDev
  ? 'http://localhost:3000'
  : `file://${path.join(__dirname, '../../build/index.html')}`;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

const statInkStore = new Store({
  configName: 'stat-ink',
  defaults: {
    info: {}
  }
});

ipcMain.on('setUserLangauge', (event, value) => {
  userDataStore.set('locale', value);
  splatnet.setUserLanguage(value);
  eSplatnet.clearSplatnetCache();
  event.returnValue = true;
});

ipcMain.on('getFromStore', (event, settingName) => {
  event.returnValue = userDataStore.get(settingName);
});

ipcMain.on('setToStore', (event, settingName, value) => {
  userDataStore.set(settingName, value);
  event.returnValue = true;
});

ipcMain.on('getFromStatInkStore', (event, settingName) => {
  event.returnValue = statInkStore.get(settingName);
});

ipcMain.on('setToStatInkStore', (event, settingName, value) => {
  statInkStore.set(settingName, value);
  event.returnValue = true;
});

ipcMain.on('getSessionToken', event => {
  event.returnValue = userDataStore.get('sessionToken');
});

ipcMain.on('writeToStatInk', async (event, result, type) => {
  try {
    const info = await writeToStatInk(
      userDataStore.get('statInkToken'),
      result
    );
    switch (type) {
      case 'manual':
        event.sender.send('wroteBattleManual', info, result.battle_number);
        break;
      case 'auto':
        event.sender.send('wroteBattleAuto', info, result.battle_number);
        break;
      default:
        event.sender.send('wroteBattleAll', info, result.battle_number);
        break;
    }
  } catch (e) {
    const message = `Failed to write #${result.battle_number} to stat.ink: ${e}`;
    uaException(message);
    log.error(message);
    switch (type) {
      case 'manual':
        event.sender.send('writeBattleManualError', {
          username: '',
          battle: -1
        });
        break;
      case 'auto':
        event.sender.send('writeBattleAutoError', { username: '', battle: -1 });
        break;
      default:
        event.sender.send('writeBattleAllError', { username: '', battle: -1 });
        break;
    }
  }
});

ipcMain.on('getStatInkApiToken', (event, result) => {
  event.returnValue = userDataStore.get('statInkToken');
});

ipcMain.on('setStatInkApiToken', (event, value) => {
  userDataStore.set('statInkToken', value);
  event.returnValue = true;
});

ipcMain.on('saveBattlesToCsv', (event, file, csv) => {
  fs.writeFileSync(file, csv);
});

function isTokenGood(token) {
  return !!token;
}

async function getStoredSessionToken() {
  let sessionToken = userDataStore.get('sessionToken');

  if (isTokenGood(sessionToken)) {
    try {
      await splatnet.getSessionWithSessionToken(sessionToken);
      const language = userDataStore.get('locale');
      if (language.length > 0) {
        splatnet.setUserLanguage(language);
      }
    } catch (e) {
      log.info(e);
      log.info('SessionToken has probably expired, please login again');
      // userDataStore.set('sessionToken', '');
    }
  }
}

function createMenusMacOS() {
  // Creates an application Edit menu (top bar) which enables copy & paste on MacOS
  var template = [
    {
      label: app.getName(),
      submenu: [
        {
          label: 'About SquidTracks',
          selector: 'orderFrontStandardAboutPanel:'
        },
        { type: 'separator' },
        { label: 'Hide SquidTracks', role: 'hide' },
        { label: 'Hide Other Applications', role: 'hideothers' },
        { label: 'Unhide', role: 'unide' },
        { type: 'separator' },
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click: function() {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { label: 'Undo', accelerator: 'CmdOrCtrl+Z', selector: 'undo:' },
        { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', selector: 'redo:' },
        { type: 'separator' },
        { label: 'Cut', accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
        { label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
        { label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
        {
          label: 'Select All',
          accelerator: 'CmdOrCtrl+A',
          selector: 'selectAll:'
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        { label: 'Reset Zoom', role: 'resetzoom' },
        { label: 'Zoom In', role: 'zoomin' },
        { label: 'Zoom Out', role: 'zoomout' },
        { type: 'separator' },
        { label: 'Toggle Full Screen', role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Window',
      role: 'window',
      submenu: [
        { label: 'Minimize', role: 'close' },
        { label: 'Close', role: 'close' }
      ]
    },
    {
      label: 'Help',
      role: 'help',
      submenu: [{ label: '' }]
    }
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

function createWindow() {
  eSplatnet.registerSplatnetHandler();
  getStoredSessionToken();
  // Check if we are on OSX
  if (process.platform === 'darwin') {
    // If so, create the top bar menus which enable copy & paste
    createMenusMacOS();
  }

  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768
  });

  mitm.setMainWindow(mainWindow);
  eSplatnet.setMainWindow(mainWindow, startUrl);

  // comment this in on first run to get dev tools
  if (isDev) {
    const {
      default: installExtension,
      REACT_DEVELOPER_TOOLS
    } = require('electron-devtools-installer');
    installExtension(REACT_DEVELOPER_TOOLS)
      .then(name => console.log(`Added Extension:  ${name}`))
      .catch(err => console.log('An error occurred: ', err));
  }

  mainWindow.loadURL(startUrl);

  // mainWindow.webContents.openDevTools();

  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function() {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});
