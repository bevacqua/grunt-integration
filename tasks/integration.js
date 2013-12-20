'use strict';

module.exports = function (grunt) {
    var _ = require('lodash');
    var async = require('async');
    var chalk = require('chalk');
    var spawn = require('spawn-machine');
    var finder = require('process-finder');
    var pkg = require('../package.json');
    var context = {};

    grunt.registerMultiTask('integration', pkg.description, function () {
        var done = this.async();
        var name = this.target;

        var ctx = context[name] = {
            name: name,
            options: this.options({
                program: 'node app',
                program_port: process.env.TEST_PORT || 3333,
                program_inherit: true,
                selenium_inherit: false,
                tests: {
                    hostname: '127.0.0.1',
                    port: 4444,
                    usePromises: true,
                    concurrency: 1,
                    browsers: [{ browserName: 'chrome' }],
                    timeout: 40000,
                    reporter: 'spec'
                }
            }),
            files: this.files
        };

        async.series([
            async.apply(selenium, ctx),
            async.apply(program, ctx),
            async.apply(tests, ctx)
        ], done);
    });

    function selenium (ctx, next) {
        var standalone = require('../lib/standalone.js');
        var rready = /Started org\.openqa\.jetty\.jetty\.Server/i;
        var rwarning = /\b(warn(ing)?|error|exception)\b/i;

        console.log(chalk.magenta('Spawning selenium server...'));

        var child = standalone.start({ stdio: 'pipe' });

        ctx.selenium = {
            name: 'Selenium',
            child: child
        };

        var teardown = cleanup.bind(null, ctx.selenium);

        child.stdout.on('data', function (data) {
            var stdout = data.toString();
            if (ctx.options.selenium_inherit) {
                process.stdout.write(stdout);
            }

            if (rready.test(stdout)) {
                console.log(chalk.magenta('Selenium server operational'));
                next();
            }
        });

        child.stderr.on('data', function (data) {
            if (ctx.options.selenium_inherit) {
                process.stderr.write(data);
            } else {
                var print = rwarning.test(data);
                if (print) {
                    process.stderr.write(chalk.red('[SELENIUM] ' + data));
                }
            }
        });

        process.on('exit', teardown);
    }


    function program (ctx, next) {
        var port = ctx.options.program_port;
        var watcher = finder.watch({ port: port, frequency: 400 });
        var env = _.clone(process.env);
        env.PORT = port;

        console.log(chalk.magenta('Spawning application...'));

        var child = spawn(ctx.options.program, {
            stdio: ctx.options.program_inherit ? 'inherit' : 'pipe',
            env: env
        });

        ctx.app = {
            name: 'Application',
            child: child
        };

        var teardown = cleanup.bind(null, ctx.app);

        watcher.on('listen', function () {
            console.log(chalk.magenta('Application online'));
            next();
        });

        process.on('exit', teardown);
    }

    function tests (ctx, next) {
        var testdrive = require('../lib/testdrive.js');

        console.log(chalk.magenta('Preparing to execute tests...'));
        testdrive(ctx.files, ctx.options.tests, next);
    }

    function cleanup (target) {
        if (target.terminated) {
            return;
        }

        target.terminated = true;

        if (target.child) {
            target.child.kill('SIGHUP');
            console.log('%s process %s shutting down', chalk.magenta(target.name), chalk.yellow(target.child.pid));
        } else {
            console.log(chalk.magenta(target.name), chalk.red('process not found'));
        }
    }
};
