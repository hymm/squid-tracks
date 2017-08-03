const request2 = require('request-promise-native');
const crypto = require('crypto');
const base64url = require('base64url');
// use this like to proxy through fiddler
// request = request2.defaults({ proxy: 'http://localhost:8888', "rejectUnauthorized": false, jar: true });
request = request2.defaults({ jar: true });

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

async function getSessionToken(session_token_code, codeVerifier) {
    const resp = await request({
        method: 'POST',
        uri: 'https://accounts.nintendo.com/connect/1.0.0/api/session_token',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-Platform': 'Android',
            'X-ProductVersion': '1.0.4',
            'User-Agent': 'com.nintendo.znca/1.0.4 (Android/4.4.2)',
        },
        form: {
            'client_id': '71b963c1b7b6d119',
            'session_token_code': session_token_code,
            'session_token_code_verifier': codeVerifier,
        },
        json: true,
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
            'X-ProductVersion': '1.0.4',
            'User-Agent': 'com.nintendo.znca/1.0.4 (Android/4.4.2)'
        },
        json: {
            'client_id': '71b963c1b7b6d119',
            'grant_type': 'urn:ietf:params:oauth:grant-type:jwt-bearer-session-token',
            'session_token': session_token,
        },
    });

    return {
        id: resp.id_token,
        access: resp.access_token,
    }
}

async function getUserInfo(token) {
    const response = await request({
        method: 'GET',
        uri: 'https://api.accounts.nintendo.com/2.0.0/users/me',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'X-Platform': 'Android',
            'X-ProductVersion': '1.0.4',
            'User-Agent': 'com.nintendo.znca/1.0.4 (Android/4.4.2)',
            'Authorization': `Bearer ${token}`,
        },
        json: true,
    });

    return {
        language: response.language,
        birthday: response.birthday,
        country: response.country,
    };
}

async function getApiLogin(id_token, userinfo) {
    const resp = await request({
        method: 'POST',
        uri: 'https://api-lp1.znc.srv.nintendo.net/v1/Account/Login',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'X-Platform': 'Android',
            'X-ProductVersion': '1.0.4',
            'User-Agent': 'com.nintendo.znca/1.0.4 (Android/4.4.2)',
            'Authorization': 'Bearer',
        },
        body: {
            "parameter": {
                "language": userinfo.language,
                'naCountry': userinfo.country,
                "naBirthday": userinfo.birthday,
                "naIdToken": id_token
            }
        },
        json: true,
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
            'X-ProductVersion': '1.0.4',
            'User-Agent': 'com.nintendo.znca/1.0.4 (Android/4.4.2)',
            'Authorization': `Bearer ${token}`,
            // 'Access-Control-Allow-Origin': '*',
        },
        json: {
            "parameter": {
                "id": 5741031244955648, // SplatNet 2 ID
            }
        },
    });

    return {
        accessToken: resp.result.accessToken,
        expiresAt: Math.round((new Date()).getTime()) + resp.result.expiresIn,
    };
}

async function getSplatnetApi(url) {
  const resp = await request({
      method: 'GET',
      uri: `https://app.splatoon2.nintendo.net/api/${url}`,
      json: true,
  });

  return resp;
}

async function getSessionCookie(token) {
    const resp = await request({
        method: 'GET',
        uri: `https://app.splatoon2.nintendo.net`,
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'X-Platform': 'Android',
            'X-ProductVersion': '1.0.4',
            'User-Agent': 'com.nintendo.znca/1.0.4 (Android/4.4.2)',
            'x-gamewebtoken': token,
            'x-isappanalyticsoptedin': false,
            'X-Requested-With': 'com.nintendo.znca',
        },
    });
}

async function getSplatnetSession(sessionTokenCode, sessionVerifier) {
  const sessionToken = await getSessionToken(sessionTokenCode, sessionVerifier);
  const apiTokens = await getApiToken(sessionToken);
  const userInfo = await getUserInfo(apiTokens.access);
  const apiAccessToken = await getApiLogin(apiTokens.id, userInfo);
  const splatnetToken = await getWebServiceToken(apiAccessToken);
  await getSessionCookie(splatnetToken.accessToken);

  return splatnetToken;
}

exports.generateAuthenticationParams = generateAuthenticationParams;
exports.getSplatnetSession = getSplatnetSession;
exports.getSplatnetApi = getSplatnetApi;
