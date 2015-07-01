var semver = require('semver');

module.exports = (l, r) => {
  var lm = String(l.match(/(\d[^ ]+)/)[0]);
  var rm = String(r.match(/(\d[^ ]+)/)[0]);
  return semver.compare(semver.valid(lm) ? lm : '0.0.0',
    semver.valid(rm) ? rm : '0.0.0');
};
