#! /usr/bin/env node
// Load in external libraries
var inquirer = require("inquirer");

// Load in some useful functions
var tools = require('./lib/helpers/tools.js');

// Load in our different build options
var buildWordpress = require('./lib/builds/wordpress.js');
var buildStatic = require('./lib/builds/static.js');
var buildJekyll = require('./lib/builds/jekyll.js');


tools.createTitle('Current directory: ' + process.cwd());

inquirer.prompt([{
    type: "list",
    message: "Select your site type",
    name: "buildOption",
    choices: [
        "Static",
        "Wordpress",
        "Jekyll",
        "Random Build"
    ]
}], function (answers) {
    switch (answers.buildOption) {
      case "Static":
        console.log("Static Site Picked!");
        buildStatic();
        break;
      case "Wordpress":
        console.log("Wordpress Site Picked!");
        buildWordpress();
        break;
      case "Jekyll":
        console.log("Jekyll Site Picked!");
        buildJekyll();
        break;
      default:
        console.log("Sorry, there is no build associated with " + answers.buildOption + ".");
    }
});












