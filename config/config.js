var path = require('path'),
    rootPath = path.normalize(__dirname + '/..');

var config = {
  root: rootPath,
  app: {
    name: 'bamba_scheduler'
  },
  port: 3333,
  db: 'mongodb://localhost/bamba_scheduler'
};

module.exports = config;
