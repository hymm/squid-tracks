const fs = require('mz/fs');
const path = require('path');
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
    this.filename = filename;
    this.loadFromFile(filename);
  }

  async loadFromFile(filename) {
    try {
      const userDataPath = app.getPath('userData');
      this.path = path.join(userDataPath, filename);
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
      await this.save();
    } catch (e) {
      log.error(`Could not read ${this.path} from stat.ink`);
    }
  }

  getRowWithId(id) {
    const row = this.map.find(
      row => parseInt(row.splatnet, 10) === parseInt(id, 10)
    );
    if (row == null) {
      throw Error(`Could not get id ${id} from map`);
    }

    return row;
  }

  async getInfoWithRetry(id) {
    try {
      return this.getRowWithId(id);
    } catch (e) {
      await this.getFromStatInk();
      return this.getRowWithId(id);
    }
  }

  async getKey(id) {
    return await this.getInfoWithRetry(id).key;
  }
}
module.exports = StatInkMap;
