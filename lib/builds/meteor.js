var exec = require("child_process").exec;
var helper = require('../utils/helpers.js');

module.exports = function () {
    var module = {};
    var buildSettings = {
        "name": "meteor",
        "desc": "starting package for meteor builds"
    }

    module.config = function() {
         return buildSettings;
    }

    module.init = function() {
        console.log('~ '.yellow + 'Running meteor build code... ZUG ZUG');
        buildMeteor();
    }

    function buildMeteor() {
        // Test to see if version command is recognized, if it is then it should return 'Meteor 0.0.1x\n',
        // we can check for the presence of 'Meteor' in that string, if it doesn't have it then we
        // need to prompt the user to install it if they want to.
        exec('meteor --version', function (err, stdout, stderr) {
            // console.log(err, stdout, stderr);

            if (helper.stringContains(stdout,'Meteor')) {
                console.log('~ '.yellow + 'Meteor is creating your project...');
                 exec('meteor create .', function (err) {
                    console.log('✔ '.green + 'Done! use \'meteor run\' to get started');
                 });
            } else {
                console.log('✘ '.red + 'Meteor isn\'t installed on your system, you can install it with:\ncurl https://install.meteor.com/ | sh');
            }
        });
    }

    return module;
}
