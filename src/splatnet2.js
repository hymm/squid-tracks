const request = require('request-promise-native');

const session_token_code = 'eyJhbGciOiJIUzI1NiJ9.eyJzdGM6c2NwIjpbMCw4LDksMTcsMjNdLCJ0eXAiOiJzZXNzaW9uX3Rva2VuX2NvZGUiLCJzdGM6YyI6bnVsbCwiaWF0IjoxNTAwNzY0MTk2LCJleHAiOjE1MDA3NjQ3OTYsImlzcyI6Imh0dHBzOi8vYWNjb3VudHMubmludGVuZG8uY29tIiwic3RjOm0iOm51bGwsImp0aSI6IjU0MjgwMDc0NCIsInN1YiI6ImMyM2VkMDFmYmNhNTFkMjUiLCJhdWQiOiI3MWI5NjNjMWI3YjZkMTE5In0.yti9j4-6su6P8_l0Uhu8by4cySRTrgS-zEu8IQMu1pg';

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
        body: {
            "parameter": {
                "id": 5741031244955648, // SplatNet 2 ID
            }
        },
        json: true,
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
  console.log(await getToken(session));
}
// getSplatnetSession();
module.exports = {
  getSplatnetSession,
};
