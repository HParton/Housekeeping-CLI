#! /usr/bin/env node
// Load in external libraries
var inquirer = require("inquirer");
var path = require('path');
var find = require('find-all');
var _ = require("underscore");
var colors = require('colors');
var helper = require('./lib/utils/helpers.js');

var builds = [];

console.log('~ '.yellow + 'Finding installers config files...')

  }
});

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
function getAllBuilds() {
  var builds = [];

  find(path.dirname(require.main.filename) + '/lib/builds/**/hk-*.js', function(path) {
    var build = require(path);
    var buildDetails = build().config();
    buildDetails.path = path;
    buildDetails.name = buildDetails.name.toLowerCase();
    builds.push(buildDetails);

    if (program.verbose) {
        console.log('✔ '.green + 'Found: ' + buildDetails.name + ' -- ' + buildDetails.desc);
    }
  });

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