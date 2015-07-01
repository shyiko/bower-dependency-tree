var bower = require('bower');
var winston = require('winston');

var bowerConfig = require('./bower-config');

module.exports = (endpoint) =>
  new Promise((resolve, reject) => {
    winston.info(`Fetching "${endpoint}"`);
    bower.commands.info(endpoint, null, bowerConfig())
      .on('end', (pkg) => resolve(pkg.latest ? pkg.latest : pkg))
      .on('error', reject);
  });

