// code for splanet that is specific to SquidTracks
const splatnet = require('./splatnet2');
const Memo = require('promise-memoize');
const { ipcMain, protocol } = require('electron');
const log = require('electron-log');
const { userDataStore } = require('./stores');
const { uaException } = require('./analytics');

const getSplatnetApiMemo120 = Memo(splatnet.getSplatnetApi, { maxAge: 120000 });
const getSplatnetApiMemo10 = Memo(splatnet.getSplatnetApi, { maxAge: 10000 });
const getSplatnetApiMemoInf = Memo(splatnet.getSplatnetApi);

function clearSplatnetCache() {
  getSplatnetApiMemo120.clear();
  getSplatnetApiMemo10.clear();
  getSplatnetApiMemoInf.clear();
}
module.exports.clearSplatnetCache = clearSplatnetCache;

// splatnet and stat.ink comm with renderer handling
// global to current state, code challenge, and code verifier
let authParams = {};
let sessionToken = '';

let mainWindow, startUrl;
function setMainWindow(win, url) {
  mainWindow = win;
  startUrl = url;
}
module.exports.setMainWindow = setMainWindow;

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

protocol.registerStandardSchemes(['npf71b963c1b7b6d119', 'https', 'http']);
function registerSplatnetHandler() {
  protocol.registerHttpProtocol(
    'npf71b963c1b7b6d119',
    (request, callback) => {
      const url = request.url;
      const params = {};
      url
        .split('#')[1]
        .split('&')
        .forEach(str => {
          const splitStr = str.split('=');
          params[splitStr[0]] = splitStr[1];
        });

      splatnet
        .getSplatnetSession(params.session_token_code, authParams.codeVerifier)
        .then(async tokens => {
          sessionToken = tokens.sessionToken;
          userDataStore.set('sessionToken', sessionToken);
          await splatnet.getSessionCookie(tokens.accessToken);
          const iksm = splatnet.getIksmToken();
          userDataStore.set('iksmCookie', iksm);
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
module.exports.registerSplatnetHandler = registerSplatnetHandler;

ipcMain.on('logout', event => {
  userDataStore.set('sessionToken', '');
  event.returnValue = true;
});

ipcMain.on('loadSplatnet', e => {
  const url = `https://app.splatoon2.nintendo.net?lang=en-US`;
  mainWindow.loadURL(url, {
    userAgent: 'com.nintendo.znca/1.0.4 (Android/4.4.2)'
  });
});

ipcMain.on('setIksmToken', async (e, value) => {
  try {
    await splatnet.setIksmToken(value);
    e.returnValue = true;
  } catch (err) {
    e.returnValue = false;
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
    if (url.includes('onlineshop/order')) {
      clearSplatnetCache();
    }
  } catch (e) {
    const message = `Error posting ${url}: ${e}`;
    uaException(message);
    log.error(message);
    e.returnValue = {};
  }
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
    e.sender.send('apiData', url, value);
  } catch (err) {
    const message = `Error getting ${url}: ${err}`;
    uaException(message);
    log.error(message);
    e.sender.send('apiDataError', message);
  }
});
