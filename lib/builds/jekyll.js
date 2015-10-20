var exec = require("child_process").exec;


function buildJekyll() {
    exec('jekyll new .', function (err, stdout, stderr) {
        console.log(stdout, err, stderr);
    });
}

module.exports = buildJekyll;



