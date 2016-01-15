#! /usr/bin/env node
// Load in external libraries
var inquirer = require("inquirer");
var path = require('path');
var find = require('find-all');
var _ = require("underscore");
var colors = require('colors');
var helper = require('./lib/utils/helpers.js');
var program = require('commander');
var argv = require('minimist')(process.argv.slice(2));
var exec = require('child_process').exec;
var ncu = require('npm-check-updates');

program
  .version('0.2.6')
  .option('add [build]', 'Add a npm hosted build generator')
  .option('remove [build]', 'Remove a npm hosted  build generator')
  .option('update [build]', 'Update a npm hosted  build generator')
  .option('-v, --verbose', 'Enable extra information and errors')
  .option('-d, --debug', 'Enable extra information for debugging')
  .parse(process.argv);

if (program.debug) {
  console.log(argv);
}


var buildsDir = path.dirname(require.main.filename);


if (program.add) {

  if (typeof program.add == 'string') {
    console.log('~ '.yellow + 'Finding package for ' + program.add + '...');
    // TRYING TO GET IT INSTALL SOMEWHERE V
    run('npm install --save-optional ' + program.add, {cwd: buildsDir});
  } else {
    console.log('✘ '.red + 'Please select a package to add');
  }

} else if (program.update) {

  if (typeof program.update == 'string') {
    console.log('~ '.yellow + 'Updating package for ' + program.update + '...');
    ncu.run({
        packageFile: buildsDir + '/package.json',
        upgrade: true,
        jsonUpgraded: false,
        args: [program.update, '-u']
    }).then(function(upgraded) {
        console.log('✔ '.green + program.update + ' updated');
    });
  } else {
    console.log('~ '.yellow + 'Updating packages for all builds...');
    ncu.run({
        packageFile: buildsDir +'/package.json',
        optional: true,
        upgrade: true,
        jsonUpgraded: false
    }).then(function(upgraded) {
        run('npm update', {cwd: buildsDir})
        console.log('✔ '.green + 'All builds updated');
    });
  }

} else if (program.remove) {

  if (typeof program.remove == 'string') {
    console.log('~ '.yellow + 'Removing package for ' + program.remove + '...');
    run('npm remove --save-optional ' + program.remove, {cwd: buildsDir});
  } else {
    console.log('✘ '.red + 'Please select a package to remove');
  }

} else {
  console.log('~ '.yellow + 'Finding installers config files...')
  var builds = getAllBuilds();
  selectBuildPrompt(builds);
}



function run(cmd, location){
  if (location == undefined) {
    location = './';
  }
  var child = exec(cmd, location, function (error, stdout, stderr) {
    if (stderr !== null) {
      console.log('' + stderr);
    }
    if (stdout !== null) {
      console.log('' + stdout);
    }
    if (error !== null) {
      console.log('' + error);
    }
  });
};


function selectBuildPrompt(builds) {
  inquirer.prompt([{
    type: "list",
    message: "Select your site type",
    name: "buildOption",
    choices: getAllBuildNames(builds, true)
  }], function (answers) {
      var selectedBuildPath = selectBuildByName(answers.buildOption, builds).path;
      var selectedBuild = require(selectedBuildPath);
      selectedBuild().init();
  });
}

function getAllBuilds() {
  var builds = [];

  find(path.dirname(require.main.filename) + '/node_modules/**/hk-*.js', function(path) {
    var build = require(path);
    var buildDetails = build().config();
    buildDetails.path = path;
    buildDetails.name = buildDetails.name.toLowerCase();
    builds.push(buildDetails);

    if (program.verbose) {
        console.log('✔ '.green + 'Found: ' + buildDetails.name + ' -- ' + buildDetails.desc);
    }
  });

  return builds;
}

function selectBuildByName(name, builds) {
    var found = _.select(builds, function (obj) {
      return obj.name === name.toLowerCase();
    });
    return found[0];
}

function getAllBuildNames(builds, capitalise) {
    var buildNames = [];

    for (var i = 0; i < builds.length; i++) {
        var buildName = builds[i].name;
        if (capitalise) {
            var buildName = ucfirst(buildName);
        }
        buildNames.push(buildName);
    }

    return buildNames;
}

function ucfirst(str) {
    var firstLetter = str.substr(0, 1);
    return firstLetter.toUpperCase() + str.substr(1);
}