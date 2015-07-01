var semver = require('semver');

module.exports = (range) =>
  semver.validRange(range) ?
    range.replace(/^(\d)/, '=$1').replace(/ (\d)/g, ' =$1') :
    range;

