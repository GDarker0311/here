/**
 * @since 2015-11-19 20:15
 * @author vivaxy
 */
'use strict';

const path = require('path');

const ip = require('ip');
const koa = require('koa');
const log = require('log-util');
const usageTracker = require('usage-tracker');

const isDebug = require('./is-debug.js');

//app.use(function* () {
//        let socket = this.socket;
//        socket.on('error', close);
//        socket.on('close', close);
//        let close = function () {
//            socket.removeListener('error', close);
//            socket.removeListener('close', close);
//        }
//    }
//);
module.exports = (config) => {

    const server = koa();

    let port = config.port || 3000;
    let directory = config.directory || '.';
    let middlewareList = config.middlewareList || [];
    let liveReload = config.liveReload;
    let openBrowser = config.openBrowser;

    middlewareList = middlewareList.concat(
        require('../middleware/error.js'),
        require('../middleware/folder.js')(directory),
        require('../middleware/file.js')(directory)
    );

    middlewareList.forEach(middleware => {
        server.use(middleware);
    });

    const listen = () => {
        return server.listen(port, () => {
            // success
            isDebug || usageTracker.send({
                // event
                event: 'used'
            });

            log.info('server :', 'listen', 'http://' + ip.address() + ':' + port + '/');

            let openBrowserFunction = () => {
                require('./open-browser.js')(port);
            };

            if (openBrowser) {
                openBrowserFunction();
            }
            // hit `space` will open page in browser
            let stdin = process.stdin;
            stdin.setEncoding('utf8');
            stdin.on('data', openBrowserFunction);
        }).on('error', err => {
            if (err.code === 'EADDRINUSE') {
                // red
                log.warn('server :', 'port', port, 'in use');
                port++;
                return listen();
            }
        });
    };

    listen();

    return server;

};
