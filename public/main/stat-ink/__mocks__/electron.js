const electron2 = require('electron');

const electron = {
  require: jest.genMockFunction(),
  match: jest.genMockFunction(),
  app: jest.genMockFunction(),
  remote: jest.genMockFunction(),
  dialog: jest.genMockFunction()
};

electron.app.getVersion = () => '1.1';
electron.app.getName = () => 'appName';
electron.app.getPath = () => './';

module.exports = electron;
