var inquirer = require("inquirer");
var fs = require("fs");
var helper = require('../utils/helpers.js');
var build = require('../utils/build.js');

module.exports = function () {


    var module = {};
    var buildSettings = {
        "name": "static",
        "desc": "starting package for flat html builds with either scss or css"
    }

    module.config = function() {
         return buildSettings;
    }

    module.init = function() {
        console.log('~ '.yellow + 'Running static build installer...');
        buildStatic();
    }

    function buildStatic() {
        inquirer.prompt([{
            type: "checkbox",
            message: "Select some modules to start your project with.",
            name: "modules",
            choices: [
                new inquirer.Separator("The usual:"),
                "Sass",
                "CSS",
                "HTML",
                "Javascript",
                "Grunt",
                "Gulp"
            ],
            validate: function (answer) {
                if (answer.length < 1) {
                    return "You must choose at least one module.";
                }
                return true;
            }
        }], function (answers) {
            var mainAnswers = answers;

            if (helper.stringContains(answers.modules, "Grunt") || helper.stringContains(answers.modules, "Gulp")) {

                fs.exists("package.json", function (exists) {
                    if (exists) {
                        inquirer.prompt({
                            type: "confirm",
                            name: "confirm",
                            message: "Do you want to overwrite the existing package.json ?"
                        }, function (answer) {
                            if (answer.confirm) {
                                build.createPackageInfo(answers, mainAnswers);
                            } else {
                                build.createModules(mainAnswers.modules);
                            }
                        });
                    } else {
                        build.createPackageInfo(mainAnswers);
                        // build.createModules(mainAnswers.modules);
                    }
                });

            }

            build.createModules(mainAnswers.modules);
        });
    }

    return module;
}
