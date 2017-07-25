const request = require('request-promise-native');

const session_code = '';

async function getSessionToken(session_token_code, session_state) {
    const resp = await request({
        method: 'POST',
        uri: 'https://accounts.nintendo.com/connect/1.0.0/api/session_token',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-Platform': 'Android',
            'X-ProductVersion': '1.0.4',
            // 'User-Agent': 'com.nintendo.znca/1.0.4 (Android/4.4.2)'
            'User-Agent': 'OnlineLounge/1.0.4 NASDKAPI Android',
            'Accept': 'application/json',
            'Accept-Encoding': 'gzip',
            'Accept-Language': 'en-US',
        },
        form: {
            'client_id': '71b963c1b7b6d119',
            'session_token_code': session_token_code,
            'session_token_code_verifier': session_state,
        },
    });

    return resp.id_token;
}

async function getToken(session_token) {
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

    return resp.id_token;
}

async function getApiLogin(id_token) {
    const loginId = await request({
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
                "language": "en-US",
                'naCountry': 'US',
                "naBirthday": "1989-04-06",
                "naIdToken": id_token
            }
        },
        json: true,
    });

    return loginId.accessToken;
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
            'Access-Control-Allow-Origin': '*',
        },
        form: {
            "parameter": {
                "id": 5741031244955648, // SplatNet 2 ID
            }
        },
    });

    return resp.accessToken;
}

async function getSplatnetUrl(url, token) {
  const resp = await request({
      method: 'POST',
      uri: url,
      headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'X-Platform': 'Android',
          'X-ProductVersion': '1.0.4',
          'User-Agent': 'com.nintendo.znca/1.0.4 (Android/4.4.2)',
          'x-gamewebtoken': token,
          'x-isappanalyticsoptedin': false,
          'X-Requested-With': 'com.nintendo.znca',
      },
      qs: {
        lang: 'en-US',
      },
      json: true,
  });

  return resp.accessToken;
}

async function getSplatnetSession(session) {
  console.log(await getToken(session_code));
}
// getSplatnetSession();
module.exports = {
  getSplatnetSession,
  getToken,
  getSessionToken,
};
