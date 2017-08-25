
const { protocol, app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const url = require('url');
const log = require('electron-log');
const isDev = require('electron-is-dev');
const { writeToStatInk } = require('./stat-ink/stat-ink');
const splatnet = require('./splatnet2');
const Store = require('./store');

if (!isDev) {
  require('./autoupdate');
} else {
  log.info('app running in development');
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
const startUrl =
  process.env.ELECTRON_START_URL ||
  url.format({
    pathname: path.join(__dirname, '../build/index.html'),
    protocol: 'file:',
    slashes: true
  });

const store = new Store({
  configName: 'user-data',
  defaults: { sessionToken: '', statInkToken: '', statInkInfo: {}, uuid: '', gaEnabled: true }
});

// splatnet and stat.ink comm with renderer handling
// global to current state, code challenge, and code verifier
let authParams = {};
let sessionToken = '';

protocol.registerStandardSchemes([
  'npf71b963c1b7b6d119',
  'https',
  'http'
]);
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
        log.error(e);
      }
    }
  );
}

ipcMain.on('getFromStore', (event, settingName) => {
  event.returnValue = store.get(settingName);
});

ipcMain.on('setToStore', (event, settingName, value) => {
  store.set(settingName, value);
  event.returnValue = true;
})

ipcMain.on('getSessionToken', (event) => {
    event.returnValue = store.get('sessionToken');
});

ipcMain.on('logout', (event) => {
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
        log.error(e);
        if (type === 'manual') {
          ipcMain.send('writeBattlekManualError', { username: '', battle: -1 });
        } else {
          ipcMain.send('writeBattleAutoError', { username: '', battle: -1 });            
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

ipcMain.on('getLoginUrl', (event) => {
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

ipcMain.on('loadSplatnet', (e) => {
    const url = `https://app.splatoon2.nintendo.net?lang=en-US`;
    mainWindow.loadURL(url, {
      userAgent: 'com.nintendo.znca/1.0.4 (Android/4.4.2)'
    });
});

ipcMain.on('getApi', async (e, url) => {
    try {
      e.returnValue = await splatnet.getSplatnetApi(url);
  } catch (e) {
      log.error(e);
      e.returnValue = {};
  }
});

ipcMain.on('postApi', async (e, url) => {
    try {
      e.returnValue = await splatnet.postSplatnetApi(url);
  } catch (e) {
      log.error(e);
      e.returnValue = {};
  }
});

function isTokenGood(token) {
  return !!token;
}

async function getStoredSessionToken() {
  sessionToken = store.get('sessionToken');

  if (isTokenGood(sessionToken)) {
    try {
      await splatnet.getSessionWithSessionToken(sessionToken);
    } catch (e) {
      this.store.set('sessionToken', '');
    }
  }
}

// autoupdate

function createWindow() {
  registerSplatnetHandler();
  getStoredSessionToken();

  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768
  });

  mainWindow.loadURL(startUrl);

  // mainWindow.webContents.openDevTools();

  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
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

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
