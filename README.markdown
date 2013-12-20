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
- Less painful installation process, please!

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

Option              | Default                           | Details
--------------------|-----------------------------------|------------------------
`program`           | `'node app'`                      | This will be spawned and expected to listen
`program_port`      | `process.env.TEST_PORT` or `3333` | Which port will you use?
`program_inherit`   | `true`                            | Will program output be printed to the terminal?
`selenium_inherit`  | `false`                           | Will selenium server output be printed to the terminal?
`tests`             | See below                         | These are the options passed to `mocha`

Here are the default `tests` options. Note that if you want to change something in `options.tests`, you'll need to replace the whole object, so just copy and paste the defaults, and work from there. That's just how `this.options()` works in Grunt at the moment.

```js
tests: {
    hostname: '127.0.0.1',
    port: 4444,
    usePromises: true,
    concurrency: 1,
    browsers: [{ browserName: 'chrome' }],
    timeout: 40000,
    reporter: 'spec'
}
```

#### These defaults are good enough that you don't need to touch any of it to get started.

You can just configure it like this to get started.

```js
grunt.initConfig({
    integration: {
        src: ['test/integration/**/*.js']
    }
});
```

### Usage

For usage examples, you're going to have to sink your teeth in [wd][2].

### License

MIT

  [1]: https://github.com/visionmedia/mocha
  [2]: https://github.com/admc/wd
  [3]: http://blog.ponyfoo.com/2013/12/20/is-webdriver-as-good-as-it-gets "Is WebDriver as good as it gets?"
