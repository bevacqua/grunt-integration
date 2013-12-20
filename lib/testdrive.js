'use strict';

var wd = require('wd');
var async = require('async');
var runner = require('./mocha.js');

module.exports = function (files, opts, done) {

    async.forEachSeries(files, function (fileGroup, next) {
        var queue = async.queue(function (browserOpts, dequeue) {
            prepare(browserOpts, fileGroup, dequeue);
        }, next, opts.concurrency);

        opts.browsers.forEach(enqueue.bind(null, queue));

    }, done);

    function prepare(browserOpts, fileGroup, next) {
        var style = opts.usePromises ? 'promiseChainRemote': 'remote';

        browser = wd[style](opts);
        browser.browserTitle = browserOpts.browserTitle;
        browser.init(browserOpts, function (err) {
            if (err) {
                return next(err);
            }
            run(fileGroup, browser, next);
        });
    }

    function run(fileGroup, browser, next) {
        opts.wd = wd;

        runner(opts, fileGroup, browser, grunt, function (err) {
            browser.quit();
            next(err);
        });
    }

    function enqueue(queue, browserOpts) {
        browserOpts.browserTitle = browserOpts.browserName;

        queue.push(browserOpts, function (err) {
            if (err) {
                testResult = new Error('One or more tests on Selenium failed.');
            }
        });
    }
};
