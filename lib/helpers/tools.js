var colors = require('colors');
var path = require('path');

var modulesLocal = '/project_modules/';

var localPath = function(){
	return path.dirname(require.main.filename);
}

var createTitle = function(title, color) {
    console.log();
    if (color == 'green') {
        console.log(title.green);
    } else {
        console.log(title);
    }
    console.log();
}

var modulesPath = function() {
    return localPath() + modulesLocal;
}

var optionPicked = function(array, option) {
	return array.indexOf(option) > -1;
}

var getDirectories = function(srcpath) {
  return fs.readdirSync(srcpath).filter(function(file) {
    return fs.statSync(path.join(srcpath, file)).isDirectory();
  });
}

module.exports = {
	createTitle,
	localPath,
	modulesPath,
	optionPicked,
	getDirectories
};