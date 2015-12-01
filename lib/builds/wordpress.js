var AdmZip = require('adm-zip');
var fs = require('fs-extra');
var request = require('request');
var ProgressBar = require('progress');
var ncp = require('ncp').ncp;

module.exports = function () {
    var module = {};
    var buildSettings = {
        "name": "wordpress",
        "desc": "starting package for wordpress builds"
    }

    module.config = function() {
         return buildSettings;
    }

    module.init = function() {
        console.log('~ '.yellow + 'Running wordpress build code... ZUG ZUG');
        buildWordpress();
    }


    function buildWordpress() {
        var bar;
        request('https://wordpress.org/latest.zip')
        .on('response', function(res){
            var len = parseInt(res.headers['content-length'], 10);
            bar = new ProgressBar('[:bar] :percent :etas', {
                complete: '=',
                incomplete: ' ',
                width: 20,
                total: len
            });
        })
        .on('data', function(chunk){
            bar.tick(chunk.length);
        })
        .pipe(fs.createWriteStream('wordpress.zip'))
        .on('open', function () {
            console.log('~ '.yellow + 'Downloading latest version...');
        })
        .on('close', function () {
            console.log('~ '.yellow + 'Finished Downloading, extracting...');

            var zip = new AdmZip('wordpress.zip');
            zip.extractAllTo("./", true);

            ncp('./wordpress', './', function (err) {
                if (err) {
                    return console.log(err);
                }

                console.log('~ '.yellow + 'Cleaning up all this mess...');

                fs.remove('./wordpress.zip', function (err) {
                  if (err) return console.error('✘ '.red + err)
                });
                fs.remove('./wordpress', function (err) {
                  if (err) return console.error('✘ '.red + err)
                });

                console.log('✔ '.green + 'Done!');
                console.log();


            });
        });
    }

    return module;
}
