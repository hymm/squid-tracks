const { protocol, app, BrowserWindow, ipcMain, Menu } = require('electron');
const path = require('path');
const log = require('electron-log');
const isDev = require('electron-is-dev');
const Memo = require('promise-memoize');
const fs = require('fs');

const { writeToStatInk } = require('./stat-ink/stat-ink');
const { uaException } = require('./analytics');
const splatnet = require('./splatnet2');
const Store = require('./store');
require('./battles-store');

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

const getSplatnetApiMemo120 = Memo(splatnet.getSplatnetApi, { maxAge: 120000 });
const getSplatnetApiMemo10 = Memo(splatnet.getSplatnetApi, { maxAge: 10000 });
const getSplatnetApiMemoInf = Memo(splatnet.getSplatnetApi);

function clearSplatnetCache() {
  getSplatnetApiMemo120.clear();
  getSplatnetApiMemo10.clear();
  getSplatnetApiMemoInf.clear();
}

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

const store = new Store({
  configName: 'user-data',
  defaults: {
    sessionToken: '',
    statInkToken: '',
    statInkInfo: {},
    uuid: '',
    gaEnabled: true,
    locale: ''
  }
});

const statInkStore = new Store({
  configName: 'stat-ink',
  defaults: {
    info: {}
  }
});

// splatnet and stat.ink comm with renderer handling
// global to current state, code challenge, and code verifier
let authParams = {};
let sessionToken = '';

protocol.registerStandardSchemes(['npf71b963c1b7b6d119', 'https', 'http']);
function registerSplatnetHandler() {
  protocol.registerHttpProtocol(
    'npf71b963c1b7b6d119',
    (request, callback) => {
      const url = request.url;
      const params = {};
      url.split('#')[1].split('&').forEach(str => {
        const splitStr = str.split('=');
        params[splitStr[0]] = splitStr[1];
      });

      splatnet
        .getSplatnetSession(params.session_token_code, authParams.codeVerifier)
        .then(async tokens => {
          sessionToken = tokens.sessionToken;
          store.set('sessionToken', sessionToken);
          await splatnet.getSessionCookie(tokens.accessToken);
          mainWindow.loadURL(startUrl);
        });
    },
    e => {
      if (e) {
        const message = `Error Logging into Nintendo: ${e}`;
        uaException(message);
        log.error(message);
      }
    }
  );
}

ipcMain.on('setUserLangauge', (event, value) => {
  store.set('locale', value);
  splatnet.setUserLanguage(value);
  clearSplatnetCache();
  event.returnValue = true;
});

ipcMain.on('getFromStore', (event, settingName) => {
  event.returnValue = store.get(settingName);
});

ipcMain.on('setToStore', (event, settingName, value) => {
  store.set(settingName, value);
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
  event.returnValue = store.get('sessionToken');
});

ipcMain.on('logout', event => {
  store.set('sessionToken', '');
  event.returnValue = true;
});

ipcMain.on('writeToStatInk', async (event, result, type) => {
  try {
    const info = await writeToStatInk(store.get('statInkToken'), result);
    if (type === 'manual') {
      event.sender.send('wroteBattleManual', info);
    } else {
      event.sender.send('wroteBattleAuto', info);
    }
  } catch (e) {
    const message = `Failed to write #${result.battle_number} to stat.ink: ${e}`;
    uaException(message);
    log.error(message);
    if (type === 'manual') {
      event.sender.send('writeBattleManualError', { username: '', battle: -1 });
    } else {
      event.sender.send('writeBattleAutoError', { username: '', battle: -1 });
    }
  }
});

ipcMain.on('getStatInkApiToken', (event, result) => {
  event.returnValue = store.get('statInkToken');
});

ipcMain.on('setStatInkApiToken', (event, value) => {
  store.set('statInkToken', value);
  event.returnValue = true;
});

ipcMain.on('getLoginUrl', event => {
  authParams = splatnet.generateAuthenticationParams();
  const params = {
    state: authParams.state,
    redirect_uri: 'npf71b963c1b7b6d119://auth&client_id=71b963c1b7b6d119',
    scope: 'openid%20user%20user.birthday%20user.mii%20user.screenName',
    response_type: 'session_token_code',
    session_token_code_challenge: authParams.codeChallenge,
    session_token_code_challenge_method: 'S256',
    theme: 'login_form'
  };

  const arrayParams = [];
  for (var key in params) {
    if (!params.hasOwnProperty(key)) continue;
    arrayParams.push(`${key}=${params[key]}`);
  }

  const stringParams = arrayParams.join('&');

  event.returnValue = `https://accounts.nintendo.com/connect/1.0.0/authorize?${stringParams}`;
});

ipcMain.on('loadSplatnet', e => {
  const url = `https://app.splatoon2.nintendo.net?lang=en-US`;
  mainWindow.loadURL(url, {
    userAgent: 'com.nintendo.znca/1.0.4 (Android/4.4.2)'
  });
});

ipcMain.on('getApiAsync', async (e, url) => {
  try {
    const battleRegex = /^results\/\d{1,}$/;
    const leagueRegex = /^league_match_ranking\/.*$/;
    let value;
    if (url.match(battleRegex) || url.match(leagueRegex)) {
      value = await getSplatnetApiMemoInf(url).catch(function(error) {
        if (
          error.statusCode === 404 &&
          error.options.uri.includes('league_match_ranking')
        ) {
          /*do nothing*/
        } else {
          throw error;
        }
      });
    } else if (url === 'results') {
      value = await getSplatnetApiMemo10(url);
    } else {
      value = await getSplatnetApiMemo120(url);
    }
    e.sender.send('apiData', value);
  } catch (e) {
    const message = `Error getting ${url}: ${e}`;
    uaException(message);
    log.error(message);
    e.sender.send('apiData', {});
  }
});

ipcMain.on('getApi', async (e, url) => {
  try {
    const battleRegex = /^results\/\d{1,}$/;
    const leagueRegex = /^league_match_ranking\/.*$/;
    let value;
    if (url.match(battleRegex) || url.match(leagueRegex)) {
      value = await getSplatnetApiMemoInf(url);
    } else if (url === 'results') {
      value = await getSplatnetApiMemo10(url);
    } else if (url === 'onlineshop/merchandises') {
      value = await splatnet.getSplatnetApi(url);
    } else {
      value = await getSplatnetApiMemo120(url);
    }
    e.returnValue = value;
  } catch (e) {
    const message = `Error getting ${url}: ${e}`;
    uaException(message);
    log.error(message);
    e.returnValue = {};
  }
});

ipcMain.on('postApi', async (e, url, body) => {
  try {
    e.returnValue = await splatnet.postSplatnetApi(url, body);
  } catch (e) {
    const message = `Error posting ${url}: ${e}`;
    uaException(message);
    log.error(message);
    e.returnValue = {};
  }
});

ipcMain.on('getIksmToken', async e => {
  try {
    const cookie = splatnet.getIksmToken();
    e.sender.send('iksmToken', cookie);
  } catch (err) {
    const message = `Failed to get iksm cookie: ${err}`;
    uaException(message);
    log.error(message);
    e.sender.send('getIksmTokenError', { username: '', battle: -1 });
  }
});

ipcMain.on('saveBattlesToCsv', (event, file, csv) => {
  fs.writeFileSync(file, csv);
});

function isTokenGood(token) {
  return !!token;
}

async function getStoredSessionToken() {
  sessionToken = store.get('sessionToken');

  if (isTokenGood(sessionToken)) {
    try {
      await splatnet.getSessionWithSessionToken(sessionToken);
      const language = store.get('locale');
      if (language.length > 0) {
        splatnet.setUserLanguage(language);
      }
    } catch (e) {
      log.info(e);
      log.info('SessionToken has probably expired, please login again');
      this.store.set('sessionToken', '');
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
  registerSplatnetHandler();
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
