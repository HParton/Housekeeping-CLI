#! /usr/bin/env node

var inquirer = require("inquirer");
var ncp = require('ncp').ncp;
var path = require('path');
var fs = require('fs');
var colors = require('colors');

var modulesLocal = '/project_modules/';

var gruntQuestions = [
  {
    type: "input",
    name: "project",
    message: "Project Name"
  },
  {
    type: "input",
    name: "version",
    message: "Version",
    default: function () { return "1.0.0"; }
  },
  {
    type: "input",
    name: "description",
    message: "Project Description"
  }
];
console.log('')
console.log('Current directory: ' + process.cwd());
console.log('')

inquirer.prompt([
  {
    type: "checkbox",
    message: "Selected Modules",
    name: "modules",
    choices: [
      new inquirer.Separator("The usual:"),
      {
        name: "Sass"
      },
      {
        name: "HTML",
        checked: true
      },
      {
        name: "Javascript"
      },
      new inquirer.Separator("The extras:"),
      {
        name: "Grunt",
      },
      {
        name: "Gulp"
      },
      {
        name: "Jekyll",
        disabled: "coming soon"
      }
    ],
    validate: function( answer ) {
      if ( answer.length < 1 ) {
        return "You must choose at least one module.";
      }
      return true;
    }
  }
], function( answers ) {
    var mainAnswers = answers;



    if (optionPicked(answers.modules,"Grunt")) {

        console.log('');
        console.log('Creating Grunt Config'.green);
        console.log( '' );

        inquirer.prompt( gruntQuestions, function( answers ) {
            console.log( '' );
            console.log( 'Creating package.json'.green);
            console.log( '' );

            console.log(JSON.stringify(answers, null, "  ") );

            var stream = fs.createWriteStream("package.json");

            var preferences = {
                "name" : answers.project,
                "version" : answers.version,
                "description" : answers.description
            }


            stream.write(JSON.stringify(preferences, null, "  "));
            stream.end();


            createModules(mainAnswers.modules);
        });

    } else {
        createModules(mainAnswers.modules);
    }




});

function optionPicked(array,option) {
    return array.indexOf(option) > -1;
}

function createModules(modules,ignore) {

    console.log('');
    console.log('Creating Modules'.green);
    console.log('');


    for (var i = 0; i < modules.length; i++ ) {

        if (modules[i].toLowerCase() != ignore) {
            ncp(modulesPath() + modules[i], process.cwd(), function (err) {
                if (err) {
                 return console.error(err);
                }
            });
            console.log(modulesPath() + modules[i] + ' ---> ' + process.cwd() );
        }

    }

    console.log('');


}


function modulesPath() {
    return localPath() + modulesLocal;
}

function localPath() {
    return path.dirname(require.main.filename);
}