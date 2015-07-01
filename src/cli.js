var stable = require('stable');
var chalk = require('chalk');
var winston = require('winston');

var resolve = require('./dependency-tree');
var consolidate = require('./consolidate');
var grep = require('./grep');
var explicitRange = require('./explicit-range');
var rangeComparator = require('./range-comparator');
var bowerConfig = require('./bower-config');

var sortByName = (arr) => stable(arr, (l, r) => l.name.localeCompare(r.name));

var tree = ({endpoint, name, version, dependencies, devDependencies,
  truncated, circularDependency, failedToSatisfy}, depth = 0) => {
  var prefix = ' '.repeat(depth * 4);
  var range = endpoint.split('#')[1];
  console.log(prefix + chalk.gray('+-- ') +
    (truncated ? name + '#' + version : chalk.green(name + '#' + version)) +
    (range ? ' (' + explicitRange(range) + ')' : '') +
    (truncated ? chalk.gray(' (truncated)') : '') +
    (circularDependency ? chalk.red(' (circular dependency)') : '') +
    (failedToSatisfy ? chalk.yellow(' (conflicts with ' +
      stable(failedToSatisfy, rangeComparator).join(', ') + ')') : '')
  );
  if (dependencies) {
    console.log(prefix + '    ' + chalk.gray('`-- ') +
      chalk.gray('(dependencies)'));
    sortByName(dependencies).forEach((d) => tree(d, depth + 2));
  }
  if (devDependencies) {
    console.log(prefix + '    ' + chalk.gray('`-- ') +
      chalk.gray('(devDependencies)'));
    sortByName(devDependencies).forEach((d) => tree(d, depth + 2));
  }
};

var summary = (pkg) => {
  var failedToSatisfySet = new Set();
  var circularDependencySet = new Set();
  (function stat(pkg) {
    pkg.failedToSatisfy && failedToSatisfySet.add(pkg.name);
    pkg.circularDependency && circularDependencySet.add(pkg.name);
    pkg.dependencies && pkg.dependencies.forEach(stat);
    pkg.devDependencies && pkg.devDependencies.forEach(stat);
  }(pkg));
  winston.info('Packages with circular dependencies: [' +
    chalk.red(stable([...circularDependencySet]).join(', ')) + ']');
  winston.info('Conflicting packages: [' +
    chalk.yellow(stable([...failedToSatisfySet]).join(', ')) + ']');
};

module.exports = () => {

  var argv = require('yargs')
    .usage('Usage: $0 <options> <endpoint>')
    .default({'log-level': 'info', production: false, depth: -1})
    .boolean('production')
    .alias('log-level', 'l')
    .describe('log-level',
    'Log level (set it to "debug" for more verbose logs)')
    .describe('production', 'Skip devDependencies')
    .describe('grep',
    'Hide branches of the tree not having a specific dependency')
    .describe('depth', 'Scanning depth (not limited by default)')
    .example('$0', '# "expand" bower.json')
    .example('$0 composer#2.4.0', '# print dependency tree of composer#2.4.0')
    .help('help')
    .alias('help', 'h')
    .wrap(null)
    .argv;

  bowerConfig.DEFAULT_CONFIG = argv.config || {};

  winston.level = argv['log-level'];
  winston.cli();
  winston.padLevels = false;

  resolve(argv._[0] || 'bower.json', {
      production: argv.production,
      depth: argv.depth
    })
    .then((pkg) => {
      var cpkg = consolidate(pkg);
      if (!argv.grep || grep(cpkg, argv.grep)) {
        console.log();
        tree(cpkg);
        console.log();
        summary(cpkg);
      } else {
        console.log();
        console.log('NO MATCH');
        console.log();
      }
    })
    .catch((err) => {
      console.error(err.stack);
      process.exit(1);
    });

};
