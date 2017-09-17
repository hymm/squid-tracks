const Proxy = require('http-mitm-proxy');
const electron = require('electron');
const log = require('electron-log');
const path = require('path');
const proxy = new Proxy();
const ifs = require('os').networkInterfaces();
const fs = require('fs');
const { ipcMain } = electron;

const userDataPath = (electron.app || electron.remote.app).getPath('userData');

let mainWindow;
function setMainWindow(win) {
  mainWindow = win;
}
module.exports.setMainWindow = setMainWindow;

function getIps() {
  const result = Object.keys(ifs)
    .map(x => [x, ifs[x].filter(x => x.family === 'IPv4')[0]])
    .filter(x => x[1])
    .map(x => x[1].address);
  return result;
}

ipcMain.on('getIps', e => {
  e.returnValue = getIps();
});

proxy.onCertificateRequired = (hostname, callback) => {
  console.log(userDataPath);
  return callback(null, {
    keyFile: `${userDataPath}/certs/${hostname}.key`,
    certFile: `${userDataPath}/certs/${hostname}.crt`
  });
};

proxy.onRequest((ctx, callback) => {
  if (ctx.clientToProxyRequest.headers.host === 'app.splatoon2.nintendo.net') {
    const cookies = ctx.clientToProxyRequest.headers.cookie.split(';');
    for (const cookie of cookies) {
      const cookieSplit = cookie.split('=');
      if (cookieSplit[0].trim() === 'iksm_session') {
        const cookieValue = cookieSplit[1];
        mainWindow.webContents.send('interceptedIksm', cookieValue);
        log.debug(cookieValue);
      }
    }
  } else if (ctx.clientToProxyRequest.headers.host === 'squidtracks.ink') {
    console.log(ctx.clientToProxyRequest);
    if (
      ctx.clientToProxyRequest.headers.referer ===
      'http://squidtracks.ink/squidtracks.cer'
    ) {
      console.log('cert!');
      ctx.proxyToClientResponse.writeHead(200, {
        'Content-Type': 'application/x-x509-user-cert'
      });
      fs.readFile(`${userDataPath}/certs/ca.pem`, (err, data) => {
        console.log(data);
        ctx.proxyToClientResponse.write(data);
        ctx.proxyToClientResponse.end();
      });
    } else {
      ctx.proxyToClientResponse.writeHead(200, { 'Content-Type': 'text/html' });
      ctx.proxyToClientResponse.write(
        '<a href="/squidtracks.cer">Download Certificate</a>'
      );
      ctx.proxyToClientResponse.end();
    }
    console.log('squidtracks');
  }

  return callback();
});

ipcMain.on('startMitm', e => {
  const port = 8001;
  proxy.listen({ port, sslCaDir: userDataPath });
  log.debug(`running mitm proxy on port ${port}`);
  e.returnValue = true;
});

ipcMain.on('stopMitm', e => {
  proxy.close();
  log.debug(`mitm proxy stopped`);
  e.returnValue = true;
});
