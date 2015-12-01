var colors = require('colors');
var path = require('path');
var fs = require('fs');


var localPath = function(){
	return path.dirname(require.main.filename);
};

var createTitle = function(title, color) {
    if (color == 'green') {
        console.log(title.green);
    } else {
        console.log(title);
    }
};

var modulesPath = function() {
    var modulesLocal = '/lib/modules/';
    return localPath() + modulesLocal;
};

var stringContains = function(array, option) {
	return array.indexOf(option) > -1;
};

var isEmpty = function(path, callback) {
  fs.readdir(path, function (err, files) {
    if (err === null) {
      callback(null, !!!files.length)
    } else {
      callback(err);
    }
  });
};

isEmpty.sync = function (path) {
  var files = fs.readdirSync(path);

  // Add an exception for bloody .DS_Store
  if (stringContains(files,'.DS_Store') && files.length == 1) {
    return true;
  } else {
    return !!!files.length;
  }
};

var getDirectories = function(srcpath) {
  return fs.readdirSync(srcpath).filter(function(file) {
    return fs.statSync(path.join(srcpath, file)).isDirectory();
  });
};

module.exports = {
  isEmpty: isEmpty,
	createTitle: createTitle,
	localPath: localPath,
	modulesPath: modulesPath,
	stringContains: stringContains,
	getDirectories: getDirectories
};