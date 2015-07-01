var path = require('path');

var local = require('./local-package-resolver');
var remote = require('./remote-package-resolver');

var cacheable = ((cache) => {
  return (fn) =>
    (endpoint) => cache[endpoint] ? Promise.resolve(cache[endpoint]) :
      cache[endpoint] = fn(endpoint)
})({});

module.exports = (endpoint) => {
  var split = endpoint.split(path.sep);
  return split[split.length - 1] === 'bower.json' ? local(endpoint) :
    cacheable(remote)(endpoint);
};
