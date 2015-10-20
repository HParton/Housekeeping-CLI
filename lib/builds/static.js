var inquirer = require("inquirer");
var tools = require('../helpers/tools.js');
var build = require('./index.js');

function buildStatic() {
    inquirer.prompt([
    {
        type: "checkbox",
        message: "Select some modules to start your project with.",
        name: "modules",
        choices: [
            new inquirer.Separator("The usual:"),
            {
                name: "Sass"
            },
            {
                name: "CSS"
            },
            {
                name: "HTML"
            },
            {
                name: "Javascript"
            },
            {
                name: "Grunt"
            },
            {
                name: "Gulp"
            }
        ],
        validate: function (answer) {
            if (answer.length < 1) {
                return "You must choose at least one module.";
            }
            return true;
        }
    }], function (answers) {
        var mainAnswers = answers;

        if (tools.optionPicked(answers.modules, "Grunt") || tools.optionPicked(answers.modules, "Gulp")) {

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
                    build.createModules(mainAnswers.modules);
                }
            });

        }

        build.createModules(mainAnswers.modules);
    });
}




module.exports = buildStatic;



