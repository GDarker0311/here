#!/usr/bin/env node
/**
 * @since 150130 17:29
 * @author vivaxy
 */
var chalk = require('chalk'),
    
    log = require('./lib/log'),
    Server = require('./lib/server'),
    Watcher = require('./lib/watcher'),
    argument = require('./lib/argument'),

    /**
     * main method
     */
    main = function () {
        if (argument.help) {
            log('serve-here: ' + chalk.cyan('USAGE') +
                ' ' + 'here' + ' ' +
                '[-p PORT]' + ' ' +
                '[-d DIRECTORY]' + ' ' +
                '[-s]' + ' ' +
                '[-w INTERVAL(seconds)]' + ' ' +
                '[-l]' + ' ' +
                '[-v]' + '\n' +
                chalk.cyan('             -p, --port      ') + 'specify port; default 3000' + '\n' +
                chalk.cyan('             -d, --directory ') + 'specify root directory; default .' + '\n' +
                chalk.cyan('             -s, --silent    ') + 'will not open browser' + '\n' +
                chalk.cyan('             -w, --watch     ') + 'will watch html,css,js files; once changed, reload pages; default interval 0' + '\n' +
                chalk.cyan('             -l, --log       ') + 'output log' + '\n' +
                chalk.cyan('             -v, --version   ') + 'output version'
            );
        } else if (argument.version) {
            log('serve-here: ' + require('./package.json').version);
        } else {
            var watcherPort = 13000;
            if (argument.watch) {
                var watcher = new Watcher({
                    port: watcherPort,
                    log: argument.log,
                    interval: parseInt(argument.reloadInterval),
                    directory: argument.directory,
                    callback: function () {
                        watcherPort = watcher.getPort();
                        new Server({
                            log: argument.log,
                            port: parseInt(argument.port),
                            watch: argument.watch,
                            silent: argument.silent,
                            directory: argument.directory,
                            watcherPort: watcherPort
                        });
                    }
                });
            } else {
                new Server({
                    log: argument.log,
                    port: parseInt(argument.port),
                    watch: argument.watch,
                    silent: argument.silent,
                    directory: argument.directory
                });
            }
        }
    };

main();

module.exports = main;
