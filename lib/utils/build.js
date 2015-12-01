var helper = require('./helpers.js');
var ncp = require('ncp').ncp;
var fs = require('fs');
var inquirer = require("inquirer");


var createModules = function(modules, ignore) {

     console.log('~ '.yellow + 'Creating Modules...');

    for (var i = 0; i < modules.length; i++) {
        if (modules[i].toLowerCase() != ignore) {
            ncp(helper.modulesPath() + modules[i], process.cwd());
            console.log('✔ '.green + 'Created: ' + modules[i]);
        }

    }
}

var createPackageInfo = function(mainAnswers) {
    console.log('~ '.yellow + 'Creating Project Config...');

    var packageQuestions = [
        {
            type: "input",
            name: "project",
            message: "Project Name"
        },
        {
            type: "input",
            name: "version",
            message: "Version",
            default: function () {
                return "1.0.0";
            }
        },
        {
            type: "input",
            name: "description",
            message: "Project Description"
        }
    ];

    inquirer.prompt(packageQuestions, function (answers) {
        console.log('✔ '.green + 'Created: package.json')

        console.log(JSON.stringify(answers, null, "  "));

        var preferences = {
            "name": answers.project,
            "version": answers.version,
            "description": answers.description
        }

        var stream = fs.createWriteStream("package.json");
        stream.write(JSON.stringify(preferences, null, "  "));
        stream.end();
    });
}

module.exports = {
	createModules: createModules,
	createPackageInfo: createPackageInfo
};