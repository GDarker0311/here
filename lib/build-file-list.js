/**
 * @since 150205 09:21
 * @author vivaxy
 */
'use strict';

const fs = require('fs');
const path = require('path');

const jade = require('jade');

const join = path.join;
const extname = path.extname;
const isWindows = /^win/.test(process.platform);

const AHEAD = -1;
const ABACK = 1;
const STILL = 0;
const HTML_EXTENSION = '.html';

/**
 *
 * @param {String} _a fileName
 * @param {String} _b fileName
 * @returns {number} sort value
 */
const compare = (_a, _b) => {

    let result = STILL;

    if (_a < _b) {

        result = AHEAD;

    } else if (_a > _b) {

        result = ABACK;

    }

    return result;

};

/**
 *
 * @param {Array} files folder file list
 * @param {String} pathname folder absolute path
 * @param {String} absoluteWorkingDirectory absolute root directory
 * @returns {String} html content
 */
module.exports = (files, pathname, absoluteWorkingDirectory) => {

    const baseDir = join(absoluteWorkingDirectory, pathname);

    let filesFiltered = files.filter((file) => {

        if (file.indexOf('.') === 0) {

            return false;

        }
        // #3 remove inaccessible files from file list
        // win下access任何文件都会返回可访问
        try {

            if (isWindows) {

                fs.statSync(join(baseDir, file));

            } else {

                fs.accessSync(join(baseDir, file), fs.R_OK);

            }

        } catch (e) {

            return false;

        }
        return true;

    });

    filesFiltered.sort((a, b) => {

        let _isDirectoryA = fs.lstatSync(join(baseDir, a)).isDirectory();
        let _isDirectoryB = fs.lstatSync(join(baseDir, b)).isDirectory();

        // order by priority
        if (_isDirectoryA && _isDirectoryB) {

            return compare(a, b);

        }
        if (_isDirectoryA && !_isDirectoryB) {

            return AHEAD;

        }
        if (_isDirectoryB && !_isDirectoryA) {

            return ABACK;

        }

        let _extensionA = extname(a);
        let _extensionB = extname(b);
        let _isHtmlA = _extensionA === HTML_EXTENSION;
        let _isHtmlB = _extensionB === HTML_EXTENSION;

        if (_isHtmlA && _isHtmlB) {

            return compare(a, b);

        }
        if (_isHtmlA && !_isHtmlB) {

            return AHEAD;

        }
        if (_isHtmlB && !_isHtmlA) {

            return ABACK;

        }

        if (_extensionA === _extensionB) {

            return compare(a, b);

        }

        return compare(a, b);

    });

    if (pathname !== '/') {

        filesFiltered.unshift('..');

    }

    let list = filesFiltered.map((file) => {

        let ext = extname(file);
        let _ext = 'other';

        if (ext === HTML_EXTENSION) {

            _ext = 'html';

        }
        if (fs.lstatSync(join(baseDir, file)).isDirectory()) {

            _ext = 'dir';

        }
        if (file === '..') {

            _ext = 'null';

        }
        return {
            // remove http://ip:port to redirect to correct ip:port
            href: join(pathname, file),
            className: _ext,
            fileName: file
        };

    });

    return jade.compileFile(join(__dirname, '../res/list.jade'), {
        pretty: '    '
    })({list});
};
