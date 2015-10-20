var exec = require("child_process").exec;
var tools = require('../helpers/tools.js');


function buildMeteor() {
	// Test to see if version command is recognized, if it is then it should return 'Meteor 0.0.1x\n',
	// we can check for the presence of 'Meteor' in that string, if it doesn't have it then we
	// need to run through the install script if the user wants to or just cancel out.
    exec('meteor --version', function (err, stdout, stderr) {
        // console.log(err, stdout, stderr);

        if (tools.stringContains(stdout,'Meteor')) {
        	console.log('Meteor is creating your project...');
        	 exec('meteor create .', function (err) {
        	 	console.log('Done!');
        	 	console.log('use \'meteor run\' to get started');
        	 });
        } else {
        	console.log();
        	console.log('Meteor isn\'t installed on your system, you can install it with:\ncurl https://install.meteor.com/ | sh');
        	console.log();
        }
    });
}




module.exports = buildMeteor;



