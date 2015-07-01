module.exports = function grep(pkg, filter) {
  if (pkg.name === filter || `${pkg.name}#${pkg.version}` === filter) {
    return true;
  }
  if (pkg.dependencies) {
    pkg.dependencies = pkg.dependencies.filter((pkg) => grep(pkg, filter));
    pkg.dependencies.length || (pkg.dependencies = null);
    return !!pkg.dependencies;
  }
  return false;
};
