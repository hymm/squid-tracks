const electron = require('electron');
const path = require('path');
const fs = require('fs');

class Store {
  constructor(opts) {
    const userDataPath = (electron.app || electron.remote.app)
      .getPath('userData');
    this.path = path.join(userDataPath, opts.configName + '.json');
    this.defaults = opts.defaults
    this.data = parseDataFile(this.path, opts.defaults);
  }

  get(key) {
    let value = this.data[key];
    if (value == null) {
      // value = this.defaults[key];
      value = this.defaults[key];
    }
    return value;
  }

  set(key, val) {
    this.data[key] = val;
    fs.writeFileSync(this.path, JSON.stringify(this.data));
  }
}

function parseDataFile(filePath, defaults) {
  try {
    this.defaults = defaults;
    return JSON.parse(fs.readFileSync(filePath));
  } catch (error) {
    return defaults;
  }
}

module.exports = Store;
