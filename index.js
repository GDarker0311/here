#!/usr/bin/env node
/**
 * @since 150130 17:29
 * @author vivaxy
 */
var path = require('path'),

    log = require('log-util'),
    commander = require('commander'),
    usageTracker = require('usage-tracker'),

    Server = require('./lib/server'),
    Watcher = require('./lib/watcher'),

    /**
     * new Server();
     * @param commander
     * @param watch
     * @param route
     * @returns {Server|exports|module.exports}
     */
    newServer = function (commander, watch, route) {
        return new Server({
            port: commander.port,
            watch: watch,
            silent: commander.silent,
            directory: commander.directory,
            route: route
        });
    },
    /**
     * main method
     */
    main = function () {
        commander
            .version(require('./package.json').version, '-v --version')
            .option('-l, --log', 'output log')
            .option('-s, --silent', 'will not open browser')
            .option('-w, --watch [interval]', 'will watch html,css,js files; once changed, reload pages')
            .option('-p, --port [port]', 'specify port', 3000)
            .option('-d, --directory [directory]', 'specify root directory', '.')
            .parse(process.argv);

        log.setLevel(commander.log ? 0 : 2);
        usageTracker.initialize({
            owner: 'vivaxy',
            repo: 'here',
            number: 2,
            token: require('./package.json')['usage-tracker-id'].split('').reverse().join(''),
            report: {
                'serve-here-version': require('./package.json').version
            }
        });
        process.on('uncaughtException', function (e) {
            usageTracker.send({
                // JSON.stringify(err) will convert err to `{}`
                // use error.stack for more details
                // todo how to preserve the original error output format?
                error: e.stack.split('\n')
            });
            // throw this to preserve default behaviour
            // console this instead of throw error to keep the original error trace
            log.error(e.stack);
            // still exit as uncaught exception
            process.exit(1);
        });
        usageTracker.send({
            // event
            event: 'used'
        });
        var route = {};
        /**
         * read custom route
         */
        try {
            route = require(path.join(process.cwd(), 'here.js'));
        } catch (e) {
            log.debug('custom route not found');
        }

        if (commander.watch === undefined) {
            newServer(commander, false, route);
        } else { // -w or -w 3  commander.watch === true || commander.watch === 0, 1, ...
            var watcherPort = 13000,
                watcherInterval = commander.watch === true ? 0 : commander.watch,
                watcher = new Watcher({
                    port: watcherPort,
                    interval: watcherInterval * 1000,
                    directory: commander.directory,
                    callback: function () {
                        watcherPort = watcher.getPort();
                        newServer(commander, true, route);
                    }
                });
        }
    };

main();

module.exports = main;
