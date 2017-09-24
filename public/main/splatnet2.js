const request2 = require('request-promise-native');
const crypto = require('crypto');
const base64url = require('base64url');
const cheerio = require('cheerio');
const log = require('electron-log');

const userAgentVersion = `1.1.0`;
const userAgentString = `com.nintendo.znca/${userAgentVersion} (Android/4.4.2)`;
const splatnetUrl = `https://app.splatoon2.nintendo.net`;

const jar = request2.jar();
let request;
if (process.env.PROXY) {
  const proxy = 'http://localhost:8888';
  request = request2.defaults({
    proxy: proxy,
    rejectUnauthorized: false,
    jar: jar
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
    codeChallenge
  };
}

async function getSessionToken(session_token_code, codeVerifier) {
  const resp = await request({
    method: 'POST',
    uri: 'https://accounts.nintendo.com/connect/1.0.0/api/session_token',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-Platform': 'Android',
      'X-ProductVersion': userAgentVersion,
      'User-Agent': userAgentString
    },
    form: {
      client_id: '71b963c1b7b6d119',
      session_token_code: session_token_code,
      session_token_code_verifier: codeVerifier
    },
    json: true
  });

  // should check the challege here and error if incorrect.

  return resp.session_token;
}

async function getApiToken(session_token) {
  const resp = await request({
    method: 'POST',
    uri: 'https://accounts.nintendo.com/connect/1.0.0/api/token',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'X-Platform': 'Android',
      'X-ProductVersion': userAgentVersion,
      'User-Agent': userAgentString
    },
    json: {
      client_id: '71b963c1b7b6d119',
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer-session-token',
      session_token: session_token
    }
  });

  return {
    id: resp.id_token,
    access: resp.access_token
  };
}

async function getUserInfo(token) {
  const response = await request({
    method: 'GET',
    uri: 'https://api.accounts.nintendo.com/2.0.0/users/me',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'X-Platform': 'Android',
      'X-ProductVersion': userAgentVersion,
      'User-Agent': userAgentString,
      Authorization: `Bearer ${token}`
    },
    json: true
  });

  return {
    nickname: response.nickname,
    language: response.language,
    birthday: response.birthday,
    country: response.country
  };
}

async function getApiLogin(id_token, userinfo) {
  const resp = await request({
    method: 'POST',
    uri: 'https://api-lp1.znc.srv.nintendo.net/v1/Account/Login',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'X-Platform': 'Android',
      'X-ProductVersion': userAgentVersion,
      'User-Agent': userAgentString,
      Authorization: 'Bearer'
    },
    body: {
      parameter: {
        language: userinfo.language,
        naCountry: userinfo.country,
        naBirthday: userinfo.birthday,
        naIdToken: id_token
      }
    },
    json: true,
    gzip: true
  });

  return resp.result.webApiServerCredential.accessToken;
}

async function getWebServiceToken(token) {
  const resp = await request({
    method: 'POST',
    uri: 'https://api-lp1.znc.srv.nintendo.net/v1/Game/GetWebServiceToken',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'X-Platform': 'Android',
      'X-ProductVersion': userAgentVersion,
      'User-Agent': userAgentString,
      Authorization: `Bearer ${token}`
      // 'Access-Control-Allow-Origin': '*',
    },
    json: {
      parameter: {
        id: 5741031244955648 // SplatNet 2 ID
      }
    }
  });

  return {
    accessToken: resp.result.accessToken,
    expiresAt: Math.round(new Date().getTime()) + resp.result.expiresIn
  };
}

async function getSplatnetApi(url) {
  const resp = await request({
    method: 'GET',
    uri: `${splatnetUrl}/api/${url}`,
    headers: {
      Accept: '*/*',
      'Accept-Encoding': 'gzip, deflate',
      'Accept-Language': userLanguage,
      'User-Agent': userAgentString,
      Connection: 'keep-alive'
    },
    json: true,
    gzip: true
  });

  return resp;
}

function getUniqueId(body) {
  const $ = cheerio.load(body);
  const id = $('html').data('unique-id');
  if (id == null) {
    throw Error('Could not read splatnet2 unique id');
  }
  return id;
}

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
      'X-Requested-With': 'XMLHttpRequest'
    },
    formData: body,
    gzip: true
  };
  if (body) {
    requestOptions.formData = body;
  } else {
    requestOptions.json = true;
  }

  const resp = await request(requestOptions);

  return resp;
}

async function getSessionCookie(token) {
  const resp = await request({
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
      Connection: 'keep-alive'
    }
  });

  const id = getUniqueId(resp);

  return id;
}

async function getSessionWithSessionToken(sessionToken) {
  const apiTokens = await getApiToken(sessionToken);
  const userInfo = await getUserInfo(apiTokens.access);
  userLanguage = userInfo.language;
  const apiAccessToken = await getApiLogin(apiTokens.id, userInfo);
  const splatnetToken = await getWebServiceToken(apiAccessToken);
  uniqueId = await getSessionCookie(splatnetToken.accessToken);
  return splatnetToken;
}

async function getSplatnetSession(sessionTokenCode, sessionVerifier) {
  const sessionToken = await getSessionToken(sessionTokenCode, sessionVerifier);
  const splatnetToken = await getSessionWithSessionToken(sessionToken);

  return {
    sessionToken: sessionToken,
    accessToken: splatnetToken.accessToken
  };
}

async function getSplatnetImage(battle) {
  const { url } = await postSplatnetApi(`share/results/${battle}`);
  const imgBuf = await request({
    method: 'GET',
    uri: url,
    headers: {
      'Content-Type': 'image/png'
    },
    encoding: null
  });

  // const imgEncoded = imgBuf.toString('binary');
  return imgBuf;
}

function setIksmToken(cookieValue) {
  const cookie = request2.cookie(`iksm_session=${cookieValue}`);
  jar.setCookie(cookie, splatnetUrl);
}

function getIksmToken() {
  const cookies = jar.getCookies(splatnetUrl);
  const iksmSessionCookie = cookies.find(
    cookie => cookie.key === 'iksm_session'
  );
  if (iksmSessionCookie == null) {
    throw new Error('Could not get iksm_session cookie');
  }

  return iksmSessionCookie;
}

async function checkIksmValid() {
  try {
    await getSplatnetApi('results');
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
exports.getIksmToken = getIksmToken;
exports.setUserLanguage = setUserLanguage;
exports.setIksmToken = setIksmToken;
