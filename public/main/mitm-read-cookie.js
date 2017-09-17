const Proxy = require('http-mitm-proxy');
const { ipcMain } = require('electron');
const log = require('electron-log');
const path = require('path');
const proxy = new Proxy();

let mainWindow;
function setMainWindow(win) {
  mainWindow = win;
}
module.exports.setMainWindow = setMainWindow;

proxy.onCertificateRequired = (hostname, callback) => {
  return callback(null, {
    keyFile: path.resolve('/ca/certs/', hostname + '.key'),
    certFile: path.resolve('/ca/certs/', hostname + '.crt')
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
  }

  return callback();
});

ipcMain.on('startMitm', e => {
  const port = 8001;
  proxy.listen({ port });
  log.debug(`running mitm proxy on port ${port}`);
  e.returnValue = true;
});

ipcMain.on('stopMitm', e => {
  proxy.close();
  log.debug(`mitm proxy stopped`);
  e.returnValue = true;
});
