const electron = require('electron');
const protocol = electron.protocol;
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');
const writeToStatInk = require('./stat-ink/stat-ink');
const splatnet = require('./splatnet2');
const Store = require('./store');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
const startUrl =
  process.env.ELECTRON_START_URL ||
  url.format({
    pathname: path.join(__dirname, '/../build/index.html'),
    protocol: 'file:',
    slashes: true
  });

const store = new Store({
  configName: 'user-data',
  defaults: { sessionToken: '', statInkToken: '' }
});

// global to current state, code challenge, and code verifier
let authParams = {};
let sessionToken = '';

electron.protocol.registerStandardSchemes([
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
        console.log(e);
      }
    }
  );
}

function getSessionToken() {
  return store.get('sessionToken');
}
exports.getSessionToken = getSessionToken;

function logout() {
  store.set('sessionToken', '');
}
exports.logout = logout;

// this might not be very good, going to file every time we write
exports.writeToStatInk = result => writeToStatInk(getStatInkApiToken(), result);

function getStatInkApiToken() {
  return store.get('statInkToken');
}
exports.getStatInkApiToken = getStatInkApiToken;

function setStatInkApiToken(value) {
  store.set('statInkToken', value);
}
exports.setStatInkApiToken = setStatInkApiToken;

function getLoginUrl() {
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

  return `https://accounts.nintendo.com/connect/1.0.0/authorize?${stringParams}`;
}
exports.getLoginUrl = getLoginUrl;

async function loadSplatnet() {
  const url = `https://app.splatoon2.nintendo.net?lang=en-US`;
  mainWindow.loadURL(url, {
    userAgent: 'com.nintendo.znca/1.0.4 (Android/4.4.2)'
  });
}
exports.loadSplatnet = loadSplatnet;

async function getApi(url) {
  return await splatnet.getSplatnetApi(url);
}
exports.getApi = getApi;

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

function createWindow() {
  registerSplatnetHandler();
  getStoredSessionToken();

  mainWindow = new BrowserWindow({
    width: 800,
    height: 600
  });

  mainWindow.loadURL(startUrl);

  mainWindow.webContents.openDevTools();

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
