const request2 = require('request-promise-native');
const crypto = require('crypto');
const base64url = require('base64url');
const { v4: uuidv4 } = require('uuid');
const log = require('electron-log');
const { app } = require('electron');
const Memo = require('promise-memoize');

const userAgentVersion = `1.11.0`;
const userAgentString = `com.nintendo.znca/${userAgentVersion} (Android/7.1.2)`;
const appVersion = app.getVersion();
const squidTracksUserAgentString = `SquidTracks/${appVersion}`;
const splatnetUrl = `https://app.splatoon2.nintendo.net`;

const jar = request2.jar();
let request;
if (process.env.PROXY) {
  const proxy = 'http://localhost:8888';
  request = request2.defaults({
    proxy: proxy,
    rejectUnauthorized: false,
    jar: jar,
  });
  log.info(`Splatnet proxy on ${proxy}`);
} else {
  request = request2.defaults({ jar: jar });
}

let userLanguage = 'en-US';
let uniqueId = '';

function generateRandom(length) {
  return base64url(crypto.randomBytes(length));
}

function calculateChallenge(codeVerifier) {
  const hash = crypto.createHash('sha256');
  hash.update(codeVerifier);
  const codeChallenge = base64url(hash.digest());
  return codeChallenge;
}

function generateAuthenticationParams() {
  const state = generateRandom(36);
  const codeVerifier = generateRandom(32);
  const codeChallenge = calculateChallenge(codeVerifier);

  return {
    state,
    codeVerifier,
    codeChallenge,
  };
}

async function requestWithErrorHandling(options) {
  try {
    return await request(options);
  } catch (e) {
    throw new Error(`Error requesting uri ${options.uri}: ${e.toString()}`);
  }
}

async function getSessionToken(session_token_code, codeVerifier) {
  const resp = await requestWithErrorHandling({
    method: 'POST',
    uri: 'https://accounts.nintendo.com/connect/1.0.0/api/session_token',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-Platform': 'Android',
      'X-ProductVersion': userAgentVersion,
      'User-Agent': `OnlineLounge/${userAgentVersion} NASDKAPI Android`,
    },
    form: {
      client_id: '71b963c1b7b6d119',
      session_token_code: session_token_code,
      session_token_code_verifier: codeVerifier,
    },
    json: true,
  });

  // should check the challege here and error if incorrect.

  return resp.session_token;
}

async function getApiToken(session_token) {
  const resp = await requestWithErrorHandling({
    method: 'POST',
    uri: 'https://accounts.nintendo.com/connect/1.0.0/api/token',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'X-Platform': 'Android',
      'X-ProductVersion': userAgentVersion,
      'User-Agent': `OnlineLounge/${userAgentVersion} NASDKAPI Android`,
    },
    json: {
      client_id: '71b963c1b7b6d119',
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer-session-token',
      session_token: session_token,
    },
  });

  return {
    id: resp.id_token,
    access: resp.access_token,
  };
}

async function getHash(idToken, timestamp) {
  const response = await requestWithErrorHandling({
    method: 'POST',
    uri: 'https://elifessler.com/s2s/api/gen2',
    headers: {
      'User-Agent': squidTracksUserAgentString,
    },
    form: {
      naIdToken: idToken,
      timestamp: timestamp,
    },
  });

  const responseObject = JSON.parse(response);

  return responseObject.hash;
}

async function callFlapg(idToken, guid, timestamp, login) {
  const hash = await getHash(idToken, timestamp);
  const response = await requestWithErrorHandling({
    method: 'GET',
    uri: 'https://flapg.com/ika2/api/login?public',
    headers: {
      Host: 'flapg.com',
      'User-Agent': squidTracksUserAgentString,
      'Accept-Encoding': 'gzip, deflate',
      Accept: '*/*',
      Connection: 'keep-alive',
      'x-token': idToken,
      'x-time': timestamp,
      'x-guid': guid,
      'x-hash': hash,
      'x-ver': '3',
      'x-iid': login,
    },
  });

  const responseObject = JSON.parse(response);

  return responseObject.result;
}

async function getUserInfo(token) {
  const response = await requestWithErrorHandling({
    method: 'GET',
    uri: 'https://api.accounts.nintendo.com/2.0.0/users/me',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'X-Platform': 'Android',
      'X-ProductVersion': userAgentVersion,
      'User-Agent': `OnlineLounge/${userAgentVersion} NASDKAPI Android`,
      Authorization: `Bearer ${token}`,
    },
    json: true,
  });

  return {
    nickname: response.nickname,
    language: response.language,
    birthday: response.birthday,
    country: response.country,
  };
}

async function getApiLogin(userinfo, flapg_nso) {
  const resp = await requestWithErrorHandling({
    method: 'POST',
    uri: 'https://api-lp1.znc.srv.nintendo.net/v1/Account/Login',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'X-Platform': 'Android',
      'X-ProductVersion': userAgentVersion,
      'User-Agent': userAgentString,
      Authorization: 'Bearer',
    },
    body: {
      parameter: {
        language: userinfo.language,
        naCountry: userinfo.country,
        naBirthday: userinfo.birthday,
        f: flapg_nso.f,
        naIdToken: flapg_nso.p1,
        timestamp: flapg_nso.p2,
        requestId: flapg_nso.p3,
      },
    },
    json: true,
    gzip: true,
  });
  return resp.result.webApiServerCredential.accessToken;
}

async function getWebServiceToken(token, flapg_app) {
  const resp = await requestWithErrorHandling({
    method: 'POST',
    uri: 'https://api-lp1.znc.srv.nintendo.net/v2/Game/GetWebServiceToken',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'X-Platform': 'Android',
      'X-ProductVersion': userAgentVersion,
      'User-Agent': userAgentString,
      Authorization: `Bearer ${token}`,
      // 'Access-Control-Allow-Origin': '*',
    },
    json: {
      parameter: {
        id: 5741031244955648, // SplatNet 2 ID
        f: flapg_app.f,
        registrationToken: flapg_app.p1,
        timestamp: flapg_app.p2,
        requestId: flapg_app.p3,
      },
    },
  });

  return {
    accessToken: resp.result.accessToken,
    expiresAt: Math.round(new Date().getTime()) + resp.result.expiresIn,
  };
}

async function getSplatnetApi(url) {
  const resp = await requestWithErrorHandling({
    method: 'GET',
    uri: `${splatnetUrl}/api/${url}`,
    headers: {
      Accept: '*/*',
      'Accept-Encoding': 'gzip, deflate',
      'Accept-Language': userLanguage,
      'User-Agent': userAgentString,
      Connection: 'keep-alive',
    },
    json: true,
    gzip: true,
  });

  return resp;
}

async function getUniqueId(token) {
  const records = await getSplatnetApi('records');
  uniqueId = records.records.unique_id;
  return uniqueId;
}
const getUniqueIdMemo10 = Memo(getUniqueId, { maxAge: 10000 });

async function postSplatnetApi(url, body) {
  const requestOptions = {
    method: 'POST',
    uri: `${splatnetUrl}/api/${url}`,
    headers: {
      Accept: '*/*',
      'Accept-Encoding': 'gzip, deflate',
      'Accept-Language': userLanguage,
      'User-Agent': userAgentString,
      Connection: 'keep-alive',
      'X-Unique-Id': uniqueId,
      'X-Requested-With': 'XMLHttpRequest',
    },
    formData: body,
    gzip: true,
  };
  if (body) {
    requestOptions.formData = body;
  } else {
    requestOptions.json = true;
  }

  const resp = await requestWithErrorHandling(requestOptions);

  return resp;
}

async function getSessionCookie(token) {
  const resp = await requestWithErrorHandling({
    method: 'GET',
    uri: splatnetUrl,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'X-Platform': 'Android',
      'X-ProductVersion': userAgentVersion,
      'User-Agent': userAgentString,
      'x-gamewebtoken': token,
      'x-isappanalyticsoptedin': false,
      'X-Requested-With': 'com.nintendo.znca',
      Connection: 'keep-alive',
    },
  });

  const iksmToken = getIksmToken();
  await getUniqueIdMemo10(iksmToken);
}

async function getSessionWithSessionToken(sessionToken) {
  const apiTokens = await getApiToken(sessionToken);
  const userInfo = await getUserInfo(apiTokens.access);
  userLanguage = userInfo.language;
  const guid = uuidv4();
  const timestamp = String(Math.floor(Date.now() / 1000));
  const flapg_nso = await callFlapg(apiTokens.id, guid, timestamp, 'nso');
  const apiAccessToken = await getApiLogin(userInfo, flapg_nso);
  const flapg_app = await callFlapg(apiAccessToken, guid, timestamp, 'app');
  const splatnetToken = await getWebServiceToken(apiAccessToken, flapg_app);
  await getSessionCookie(splatnetToken.accessToken);
  return splatnetToken;
}

async function getSplatnetSession(sessionTokenCode, sessionVerifier) {
  const sessionToken = await getSessionToken(sessionTokenCode, sessionVerifier);
  const splatnetToken = await getSessionWithSessionToken(sessionToken);

  return {
    sessionToken: sessionToken,
    accessToken: splatnetToken.accessToken,
  };
}

async function getSplatnetImage(battle) {
  const { url } = await postSplatnetApi(`share/results/${battle}`);
  const imgBuf = await requestWithErrorHandling({
    method: 'GET',
    uri: url,
    headers: {
      'Content-Type': 'image/png',
    },
    encoding: null,
  });

  // const imgEncoded = imgBuf.toString('binary');
  return imgBuf;
}

async function getSplatnetImageURL(battle) {
  const { url } = await postSplatnetApi(`share/results/${battle}`);
  return url;
}

async function setIksmToken(cookieValue) {
  if (cookieValue.length < 5) {
    return;
  }
  const cookie = request2.cookie(`iksm_session=${cookieValue}`);
  jar.setCookie(cookie, splatnetUrl);
  await getUniqueIdMemo10(cookieValue);
}

function getIksmToken() {
  const cookies = jar.getCookies(splatnetUrl);
  let value;
  cookies.find((cookie) => {
    if (cookie.key === 'iksm_session') {
      value = cookie.value;
    }
    return cookie.key === 'iksm_session';
  });
  if (value == null) {
    throw new Error('Could not get iksm_session cookie');
  }

  return value;
}

async function checkIksmValid() {
  try {
    const cookieValue = getIksmToken();
    await getSplatnetApi('schedule');
    return true;
  } catch (e) {
    return false;
  }
}

function setUserLanguage(language) {
  userLanguage = language;
}

exports.getUniqueId = getUniqueId;
exports.getSessionCookie = getSessionCookie;
exports.generateAuthenticationParams = generateAuthenticationParams;
exports.getSessionWithSessionToken = getSessionWithSessionToken;
exports.getSplatnetSession = getSplatnetSession;
exports.getSplatnetApi = getSplatnetApi;
exports.postSplatnetApi = postSplatnetApi;
exports.getSplatnetImage = getSplatnetImage;
exports.getSplatnetImageURL = getSplatnetImageURL;
exports.getIksmToken = getIksmToken;
exports.setUserLanguage = setUserLanguage;
exports.setIksmToken = setIksmToken;
exports.checkIksmValid = checkIksmValid;
