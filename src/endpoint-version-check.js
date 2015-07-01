var path = require('path');

var defaultCWD = process.cwd();

module.exports = (v, cwd) =>
  !(
    /^git(\+(ssh|https?))?:\/\//i.test(v) ||
    /\.git\/?$/i.test(v) ||
    /^git@/i.test(v) ||

    /^svn(\+(ssh|https?|file))?:\/\//i.test(v) ||

    /^https?:\/\//i.exec(v) ||

    /^\.\.?[\/\\]/.test(v) ||
    /^~\//.test(v) ||
    path.normalize(v).replace(/[\/\\]+$/, '') ===
      path.resolve(cwd || defaultCWD, v) ||

    v.split('/').length === 2
  );
