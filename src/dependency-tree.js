var iev = require('./endpoint-version-check');
var packageResolver = require('./package-resolver');

var resolvePackage = (endpoint, pkg, ctx) => {
  pkg.version || (pkg.version = 'latest');
  var _ = `${pkg.name}#${pkg.version}`;
  if (~ctx.path.indexOf(_)) {
    return {endpoint: endpoint, name: pkg.name, version: pkg.version,
      truncated: true, circularDependency: true};
  }
  if (ctx.visited.has(_)) {
    return {endpoint: endpoint, name: pkg.name, version: pkg.version,
      truncated: true};
  }
  ctx.visited.add(_);
  return Promise.all([
    Promise.all(!pkg.dependencies || ctx.depth >= ctx.maxDepth ? [] :
      recurse(_, pkg, 'dependencies', ctx)),
    Promise.all(!pkg.devDependencies || ctx.production ||
      ctx.depth >= ctx.maxDepth ? [] :
      recurse(_, pkg, 'devDependencies', ctx))
  ]).then(([dependencies, devDependencies]) => {
      var r = {endpoint: endpoint, name: pkg.name, version: pkg.version};
      dependencies.length && (r.dependencies = dependencies);
      devDependencies.length && (r.devDependencies = devDependencies);
      return r;
    });
};

var resolve = (endpoint, ctx) =>
  packageResolver(endpoint).then((pkg) => resolvePackage(endpoint, pkg, ctx));

var packageEndpoint = (pkg) =>
  pkg.name + (iev(pkg.version) ? '#' : '=') + pkg.version;

var recurse = (endpoint, pkg, field, ctx) =>
  Object.keys(pkg[field]).map((key) => {
    return resolve(packageEndpoint({name: key, version: pkg[field][key]}),
      Object.assign({}, ctx, {
        path: ctx.path.concat(endpoint, field),
        depth: ctx.depth + 1
      }));
  });

module.exports = (endpoint, options = {}) => {
  return resolve(endpoint, {
    path: [],
    production: !!options.production,
    depth: 0,
    maxDepth: options.depth == null || options.depth < 0 ?
      Number.MAX_VALUE : options.depth,
    visited: new Set()
  });
};
