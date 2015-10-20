var tools = require('../helpers/tools.js');
var ncp = require('ncp').ncp;
var fs = require('fs');
var inquirer = require("inquirer");


var createModules = function(modules, ignore) {

    tools.createTitle('Creating Modules', 'green');


    for (var i = 0; i < modules.length; i++) {

        if (modules[i].toLowerCase() != ignore) {
            ncp(tools.modulesPath() + modules[i], process.cwd(), function (err) {
                if (err) {
                    return console.error(err);
                }
            });
            console.log(tools.modulesPath() + modules[i] + ' ---> ' + process.cwd());
        }

    }

    console.log();
}

var createPackageInfo = function(mainAnswers) {
    tools.createTitle('Creating Project Config', 'green');

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
        tools.createTitle('Creating package.json', 'green');

        console.log(JSON.stringify(answers, null, "  "));
        console.log();

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
	createModules,
	createPackageInfo
};