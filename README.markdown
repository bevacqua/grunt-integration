# grunt-integration [![Build Status](https://travis-ci.org/bevacqua/grunt-integration.png?branch=master)](https://travis-ci.org/bevacqua/grunt-integration) [![Dependency Status](https://gemnasium.com/bevacqua/grunt-integration.png)](https://gemnasium.com/bevacqua/grunt-integration) [![help me on gittip](http://gbindex.ssokolow.com/img/gittip-43x20.png)](https://www.gittip.com/bevacqua/) [![flattr.png](https://api.flattr.com/button/flattr-badge-large.png)](https://flattr.com/submit/auto?user_id=nzgb&url=https%3A%2F%2Fgithub.com%2Fbevacqua%2Fgrunt-integration)

> Run Integration Tests using Selenium, Mocha, a Server, and a Browser

### Features

These are the goals of `grunt-integration`.

- Start a local selenium server instance
- Start a local program, such as `node` application
- Wait for the program to listen on a specific port
- Execute integration tests using [Mocha][1] and [WebDriver][2]
- Using real browsers, such as Chrome
- Automatically, in one command
- None or little installation hassle

[**Read the article on Pony Foo**][3]

### Installation

You'll need `node`, `java`. If you have `apt-get`, you can get `java` using the command below. If you like clicking on things, just google for a jdk distribution, and install that.

```shell
sudo apt-get install openjdk-7-jdk -y
```

Then install `grunt-integration` from `npm`.

```shell
npm install --save-dev grunt-integration
```

### Configuration

Here are the default `options`.

```js
{
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
}
```

These defaults are good enough that you don't need to touch any of it to get started. You can just configure it like this to get started.

```js
grunt.initConfig({
    integration: {
        src: ['test/integration/**/*.js']
    }
});
```

Note that if you want to change something in `options.tests`, you'll need to replace the whole object, so just copy and paste the defaults, and work from there. That's just how `this.options()` works in Grunt at the moment.

### License

MIT

  [1]: https://github.com/visionmedia/mocha
  [2]: https://github.com/admc/wd
  [3]: http://blog.ponyfoo.com/2013/12/20/is-webdriver-as-good-as-it-gets "Is WebDriver as good as it gets?"
