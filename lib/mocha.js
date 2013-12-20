var Mocha = require('mocha');
var path = require('path');
var Module = require('module');
var fs = require('fs');
var path = require('path');
var domain = require('domain');

module.exports = function (opts, fileGroup, browser, grunt, done) {
console.log('1');
    var mocha = new Mocha(opts);

console.log('2');
    mocha.suite.on('pre-require', function (context, file, m) {
        this.ctx.browser = browser;
        this.ctx.wd = opts.wd;
    });
console.log('3');

    grunt.file.expand({ filter: 'isFile' }, fileGroup.src).forEach(function (file) {
        var filePath = path.resolve(file);
        if (Module._cache[filePath]) {
            delete Module._cache[filePath];
        }
        mocha.addFile(filePath);
    });
console.log('foo');
    if (mocha.files.length) {
        mocha.loadFiles();
    }
console.log('los');
    var context = domain.create();
    var mochaOptions = mocha.options;
    var mochaRunner = new Mocha.Runner(mocha.suite);
    var mochaReporter = new mocha._reporter(mochaRunner);

    mochaRunner.ignoreLeaks = mochaOptions.ignoreLeaks !== false;
    mochaRunner.asyncOnly = mochaOptions.asyncOnly;

    if (mochaOptions.grep) {
        mochaRunner.grep(mochaOptions.grep, mochaOptions.invert);
    }

    if (mochaOptions.globals) {
        mochaRunner.globals(mochaOptions.globals);
    }
console.log('cy');
    context.on('error', mochaRunner.uncaught.bind(mochaRunner));
    context.run(function () {console.log('run');
        mochaRunner.run(function (errCount) {console.log(errCount);
            var err;
            if (errCount !== 0) {
                err = new Error('Tests encountered ' + errCount + ' errors.');
            }
            done(err);
        });
    });
};
