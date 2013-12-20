'use strict';

var wd = require('wd');
var chalk = require('chalk');
var async = require('async');
var mocha = require('./mocha.js');

module.exports = function (files, opts, done) {

    var testResult;

    async.forEachSeries(files, function (fileGroup, next) {
        var queue = async.queue(function (browserOpts, dequeue) {
            prepare(browserOpts, fileGroup, dequeue);
        }, opts.concurrency);

        opts.wd = wd;
        opts.browsers.forEach(function (browserOpts) {
            queue.push(browserOpts, function (err) {
                if (err) {
                    testResult = new Error('One or more tests on Selenium failed.');
                }
            });
        });

        queue.drain = function () {
            next(testResult);
        };

    }, done);

    function prepare(browserOpts, fileGroup, next) {
        var style = opts.usePromises ? 'promiseChainRemote': 'remote';
        var browser = wd[style]({
            hostname: opts.hostname,
            port: opts.port
        });
        browserOpts.browserTitle = browserOpts.browserName;
        browser.browserTitle = browserOpts.browserTitle;
        browser.init(browserOpts, function (err) {
            if (err) {
                return next(err);
            }
            console.log(chalk.magenta('Running tests on %s'), browser.browserTitle);

            mocha(opts, fileGroup, browser, function (err) {
                browser.quit();
                next(err);
            });
        });
    }
};
