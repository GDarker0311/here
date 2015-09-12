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
     * @param watcherPort
     * @returns {Server|exports|module.exports}
     */
    newServer = function (commander, watch, route, watcherPort) {
        return new Server({
            port: commander.port,
            watch: watch,
            silent: commander.silent,
            directory: commander.directory,
            route: route,
            watcherPort: watcherPort
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
            .option('-w, --watch [interval]', 'will watch js,css,html files; once changed, reload pages', 0)
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
            new usageTracker.UsageTracker({
                owner: 'vivaxy',
                repo: 'here',
                number: 4,
                token: require('./package.json')['usage-tracker-id'].split('').reverse().join(''),
                report: {
                    'serve-here-version': require('./package.json').version
                }
            }).on('end', function () {
                    process.exit(1);
                }).on('err', function () {
                    process.exit(1);
                }).send({
                    // JSON.stringify(err) will convert err to `{}`
                    // use error.stack for more details
                    error: e.stack.split('\n')
                });
            // throw this to preserve default behaviour
            // console this instead of throw error to keep the original error trace
            log.error(e.stack);
            // still exit as uncaught exception
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
            newServer(commander, false, route, 13000);
        } else { // -w or -w 3  commander.watch === true || commander.watch === 0, 1, ...
            var watcherPort = 13000,
                watcher = new Watcher({
                    port: watcherPort,
                    interval: (commander.watch === true ? 0 : commander.watch) * 1000,
                    directory: commander.directory
                }).on('success', function () {
                        watcherPort = watcher.getPort();
                        newServer(commander, true, route, watcherPort);
                    });
        }
    };

main();

module.exports = main;
