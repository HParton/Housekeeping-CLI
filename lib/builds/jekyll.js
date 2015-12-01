var helper = require('../utils/helpers.js');
var exec = require("child_process").exec;
var fs = require("fs-extra");
var _ = require("underscore");
var helper = require('../utils/helpers.js');


module.exports = function () {
	var module = {};
	var buildSettings = {
		"name": "jekyll",
		"desc": "starting package for jekyll builds"
	}

	module.config = function() {
		 return buildSettings;
	}

	module.init = function() {
		console.log('~ '.yellow + 'Running jekyll build installer...');
		buildJekyll();
	}


	function buildJekyll() {
	    exec('jekyll --v', function (err, stdout, stderr) {
	        if (helper.stringContains(stdout,'jekyll')) {
				var empty = helper.isEmpty.sync('./');
			    if (empty) {
				    exec('jekyll new .');
					console.log('✔ '.green + 'Done!');
				} else {
					console.log('✘ '.red + 'Jekyll needs to be deployed in an empty directory');
				}
	        } else {
	        	console.log('✘ '.red + 'Jeykll isn\'t installed on your system, you can install it with:\ngem install jekyll');
	        }
	    });
	}

	return module;
}