var semver = require('semver');

var explicitRange = require('./explicit-range');

var index = (pkg, idx = {ranges: new Map(), versions: new Map()}) => {
  var {name, version, dependencies, devDependencies} = pkg;
  var range = pkg.endpoint.split('#')[1];
  var rangeSet = idx.ranges.get(name) || new Set();
  idx.ranges.set(name, rangeSet);
  semver.validRange(range) && rangeSet.add(range);
  idx.versions.set(name,
    (idx.versions.get(name) || new Set()).add(version));
  dependencies && dependencies.forEach((d) => index(d, idx));
  return idx;
};

var consolidate = (pkg, idx) => {
  var {name, version, dependencies, devDependencies} = pkg;
  var failedToSatisfy = [...idx.ranges.get(name)].reduce((r, range) =>
    version === 'latest' || semver.satisfies(version, range) ?
      r : r.concat(range)
    , []);
  if (failedToSatisfy.length) {
    var versionWithinRange = [...idx.versions.get(name)].reduce((r, version) =>
      version === 'latest' || semver.satisfies(version, [...idx.ranges.get(name)].join(' ')) ?
        r.concat(version) : r
      , []).sort((l, r) => semver.gt(l, r))[0];
    if (versionWithinRange) {
      pkg.resolvedVersion = pkg.version;
      pkg.version = versionWithinRange;
    } else {
      pkg.failedToSatisfy = failedToSatisfy.map(explicitRange);
    }
  }
  if (dependencies) {
    dependencies.forEach((d) => consolidate(d, idx));
  }
  return pkg;
};

module.exports = (pkg) => consolidate(pkg, index(pkg));
