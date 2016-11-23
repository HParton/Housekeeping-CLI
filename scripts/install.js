#!/usr/bin/env node

var path = require('path');
var exec = require('child_process').exec;
var buildsDir = path.dirname(require.main.filename);

run('npm install housekeeping-static', {cwd: buildsDir});

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