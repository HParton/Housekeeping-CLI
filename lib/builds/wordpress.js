var AdmZip = require('adm-zip');
var fs = require('fs-extra');
var request = require('request');
var ProgressBar = require('progress');
var ncp = require('ncp').ncp;


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
        console.log();
        console.log('Downloading latest version...');
    })
    .on('close', function () {
        console.log();
        console.log('Finished Downloading, extracting...');

        var zip = new AdmZip('wordpress.zip');
        zip.extractAllTo("./", true);

        ncp('./wordpress', './', function (err) {
            if (err) {
                return console.log(err);
            }

            console.log('Done!');
            console.log();
            console.log('Cleaning up all this mess...');

            fs.remove('./wordpress.zip', function (err) {
              if (err) return console.error(err)
            });
            fs.remove('./wordpress', function (err) {
              if (err) return console.error(err)
            });

            console.log('Done!');
            console.log();


        });
    });
}

module.exports = buildWordpress;



