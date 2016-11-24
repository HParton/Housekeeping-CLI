#! /usr/bin/env node
// Load in external libraries
var inquirer = require("inquirer");
var path = require('path');
var _ = require("underscore");
var colors = require('colors');
var program = require('commander');
var argv = require('minimist')(process.argv.slice(2));
var exec = require('child_process').exec;
var ncu = require('npm-check-updates');

var Configstore = require('configstore')
var pkg = require('./package.json');

var conf = new Configstore(pkg.name, {builds: []});

program
  .version('1.1.0')
  .option('add [build]', 'Add a npm hosted build generator')
  .option('remove [build]', 'Remove a npm hosted  build generator')
  .option('update [build]', 'Update a npm hosted  build generator')
  .option('list', 'List all currently installed packages')
  .option('-v, --verbose', 'Enable extra information and errors')
  .option('-d, --debug', 'Enable extra information for debugging')
  .parse(process.argv);

if (program.debug) {
  console.log(argv);
}


var buildsDir = path.dirname(require.main.filename);

if (program.add) {

  if (typeof program.add == 'string') {
    info('Finding package for ' + program.add + '...');
    addPackage(program.add, true);
  } else {
    warn('Please select a package to add');
  }

  return;
}

if (program.update) {

  if (typeof program.update == 'string') {
    info('Updating package for ' + program.update + '...');
    ncu.run({
        packageFile: buildsDir + '/package.json',
        upgrade: true,
        jsonUpgraded: false,
        args: [program.update, '-u']
    }).then(function(upgraded) {
        // TODO: Update the versions in the config file for this build.
        // TODO: Check if the version is newer before assuming it updated.
        success(program.update + ' updated');
    });
  } else {
    info('Updating packages for all builds...');
    ncu.run({
        packageFile: buildsDir +'/package.json',
        optional: true,
        upgrade: true,
        jsonUpgraded: false
    }).then(function(upgraded) {
        run('npm update', {cwd: buildsDir})
        // TODO: Update the versions in the config file for all affected packages.
        success('All builds updated');
    });
  }

  return;
}

if (program.remove) {

  if (typeof program.remove == 'string') {
    if (selectBuildByName(program.remove, conf.get('builds')) !== undefined) {
      info('Removing package ' + program.remove + ' from housekeeping...');
      run('npm remove ' + program.remove, {cwd: buildsDir}, function() {
        var builds = conf.get('builds');
        var index = builds.map(function(build) {
          return build.name;
        }).indexOf(program.remove);

        builds.splice(index, 1);
        conf.set('builds', builds);

        success(program.remove + ' removed.');
      });
    } else {
      warn('That package is not installed.')
    }

  } else {
    warn('Please select a package to remove');
  }

  return;
}

if (program.list) {
  var names = getAllBuildNames(conf.get('builds'));

  for (var i = 0; i < names.length; i++) {
    info(names[i]);
  }
}

if (!program.update && !program.add && !program.remove && !program.list) {
  if (conf.get('setup_complete')) {
    info('Finding installers config files...')
  }
  var builds = getAllBuilds();

  if (builds.length) {
    selectBuildPrompt(builds);
  } else {
    if (!conf.get('setup_complete')) {
      info('First time running, grabbing default builds...');

      addPackage('housekeeping-static', true, function() {
        conf.set('setup_complete', true);
        selectBuildPrompt(getAllBuilds());
      });
    } else {
      warn('Couldn\'t find any builds, make sure you added some with [hk add]');
    }
  }
}



function run(cmd, location, cb){
  if (location == undefined) {
    location = './';
  }

  var child = exec(cmd, location, function (error, stdout, stderr) {
    if (error !== null) {
      console.log('' + error);
    }

    if (cb) {
      cb(stdout);
    }

    if (!cb || program.verbose) {
      if (stderr !== null) {
        console.log('' + stderr);
      }

      if (stdout !== null) {
        console.log('' + stdout);
      }
    }
  });
};


function selectBuildPrompt(builds) {
  inquirer.prompt([{
    type: "list",
    message: "Installed builds",
    name: "buildOption",
    choices: builds
  }], function (answers) {
      var selectedBuild = require('./node_modules/'+answers.buildOption);
      info('Running ' + answers.buildOption + '...');
      selectedBuild();
  });
}

function getAllBuilds() {
  var builds = conf.get('builds');

  if (program.verbose) {
    for (var i = 0; i < builds.length; i++) {
        success('Found: ' + builds[i].name);
    }
  }

  return builds;
}

function getAllBuildNames(builds) {
  var names = [];

  for (var i = 0; i < builds.length; i++) {
    names.push(builds[i].name)
  }
}

function success(string) {
  console.log('✔ '.green + string);
}

function info(string) {
  console.log('~ '.yellow + string);
}

function warn(string) {
  console.log('✘ '.red + string);
}

function addPackage(package, verbose, cb) {
    run('npm install ' + package, {cwd: buildsDir}, function() {
      if (verbose) {
        success(package + ' installed.');
      }

      run('npm install', {cwd: buildsDir + '/node_modules/' + package}, function() {
        success(package + ' dependencies installed.');

        run('npm view ' + package, {cwd: buildsDir}, function(stdout) {
          var details = eval('(' + stdout + ')');

          var build = {
            name: details.name,
            description: details.description,
            version: details.version,
            maintainers: details.maintainers
          }

          if (program.verbose) {
            console.log(build);
          }

          var currentBuilds = conf.get('builds');
          currentBuilds.push(build);
          conf.set('builds', currentBuilds);

          if (cb) {
            cb();
          }
        })

      })
    });
}

function selectBuildByName(name, builds) {
    var found = _.select(builds, function (obj) {
      return obj.name === name.toLowerCase();
    });
    return found[0];
}