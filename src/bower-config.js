var BowerConfig = require('bower-config');

var defaultCWD = process.cwd();

module.exports = function self({cwd = defaultCWD} = {}) {
  var bowerConfig = BowerConfig.create(cwd);
  Object.keys(self.DEFAULT_CONFIG).forEach((key) => {
    bowerConfig[key] || (bowerConfig[key] = self.DEFAULT_CONFIG[key]);
  });
  return bowerConfig;
};

module.exports.DEFAULT_CONFIG = {};
