const fs = require('mz/fs');
const { app } = require('electron');
const request2 = require('request-promise-native');
const log = require('electron-log');

let request;
if (process.env.PROXY) {
  request = request2.defaults({
    proxy: 'http://localhost:8888',
    rejectUnauthorized: false,
    jar: true
  });
} else {
  request = request2;
}

class StatInkMap {
  constructor(filename, statInkUri, defaultMap) {
    this.map = defaultMap;
    this.uri = statInkUri;
    this.loadFromFile(filename);
  }

  async loadFromFile(filename) {
    try {
      const userDataPath = app.getPath('userData');
      this.path = userDataPath + filename;
      const jsonRaw = await fs.readFile(this.path);
      this.map = JSON.parse(jsonRaw);
    } catch (e) {
      await this.save();
    }
  }

  get() {
    return this.map;
  }

  async save() {
    await fs.writeFile(this.path, JSON.stringify(this.map));
  }

  async getFromStatInk() {
    try {
      this.map = await request({
        method: 'GET',
        uri: this.uri,
        json: true
      });
    } catch (e) {
      log.error(`Could not read ${this.path} from stat.ink`);
    }
  }

  getKeyFromMap(id) {
    const row = this.map.find(row => row.splatnet === id);
    if (row == null) {
      throw Error('Could not get key from map');
    }

    return row.key;
  }

  async getKey(id) {
    try {
      return this.getKeyFromMap(id);
    } catch (e) {
      await this.getFromStatInk();
      return this.getKeyFromMap(id);
    }
  }
}
module.exports = StatInkMap;
