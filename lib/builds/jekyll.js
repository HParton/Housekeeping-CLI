var exec = require("child_process").exec;
var fs = require("fs-extra");
var tools = require("../helpers/tools.js")

function buildJekyll() {



    exec('jekyll --v', function (err, stdout, stderr) {
        if (tools.stringContains(stdout,'jekyll')) {
			var empty = tools.isEmpty.sync('./');

		    if (empty) {
			    exec('jekyll new .');
			} else {
				console.log();
				console.log('Jekyll needs to be deployed in an empty directory');
				console.log();
			}
        } else {
        	console.log();
        	console.log('Jeykll isn\'t installed on your system, you can install it with:\ngem install jekyll');
        	console.log();
        }
    });

}



module.exports = buildJekyll;