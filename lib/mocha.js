var Mocha = require('mocha');
var path = require('path');
var Module = require('module');
var fs = require('fs');
var path = require('path');
var domain = require('domain');
var grunt = require('grunt');

module.exports = function (opts, fileGroup, browser, done) {
    var mocha = new Mocha(opts);

    mocha.suite.on('pre-require', function (context, file, m) {
        this.ctx.browser = browser;
        this.ctx.wd = opts.wd;
    });

    grunt.file.expand({ filter: 'isFile' }, fileGroup.src).forEach(function (file) {
        var filePath = path.resolve(file);
        if (Module._cache[filePath]) {
            delete Module._cache[filePath];
        }
        mocha.addFile(filePath);
    });

    if (mocha.files.length) {
        mocha.loadFiles();
    }

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

    context.on('error', mochaRunner.uncaught.bind(mochaRunner));
    context.run(function () {
        mochaRunner.run(function (errCount) {console.log(errCount);
            var err;
            if (errCount !== 0) {
                err = new Error('Tests encountered ' + errCount + ' errors.');
            }
            done(err);
        });
    });
};
