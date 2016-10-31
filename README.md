#serve-*here*

[![Build Status][travis-image]][travis-url]
[![NPM Version][npm-version-image]][npm-url]
[![NPM Downloads][npm-downloads-image]][npm-url]
[![MIT License][license-image]][license-url]
[![Dependency Status][david-image]][david-url]

[![NPM][nodei-image]][nodei-url]

[![NPM][nodei-dl-image]][nodei-url]

local static server

everything start from `here`

## feature

- look up available port automatically, which means multiple instances without specifying port

- custom routes by scripting `here.js`

- live reload

- support https

- add ip address to your server, which makes your server available to other devices

- resolve get, post... every method into local files, for ajax

- respond files without extension as `application/json` for ajax

- open default browser after server launched

- when the server is on, press `enter` will open the browser

## installation

`[sudo] npm install -g serve-here`

## usage

In your local folder, type `here` and it goes\!

## advanced usage

#### specify port to 8888

`here -p 8888`

or

`here --port 8888`

default port is 3000

#### switch protocol to https

`here -S`

or

`here --ssl`

#### specify server root directory

`here -d test`

or

`here --directory test`

default directory is `./`

#### watch file changes, once files changed, reload pages

`here -w 3`

or

`here --watch`

default interval is 0 second

recommend to set reload interval to page reload time

#### do not open the browser

`here -s`

or

`here --silent`

#### output log

`here -l`

or

`here --log 0`

#### middleware support

write `here.js` in server base directory

```
let db = {
    tobi: {
        name: 'tobi',
        age: 21
    },
    loki: {
        name: 'loki',
        age: 26
    },
    jane: {
        name: 'jane',
        age: 18
    }
};

module.exports = [
    {
        method: 'get',
        path: '/pets',
        data () {
            let names = Object.keys(db);
            return names.map((name) => {
                return db[name];
            });
        }
    },
    {
        method: 'get',
        path: '/pets/:name',
        data () {
            let name = this.params.name;
            let pet = db[name];
            if (!pet) {
                return {
                    error: `cannot find pet ${name}`
                };
            } else {
                return pet;
            }
        }
    }
];
```

see [koa-router document](https://github.com/alexmingoia/koa-router#module_koa-router--Router+get%7Cput%7Cpost%7Cpatch%7Cdelete) for more detail

## some similar applications

- [puer](https://www.npmjs.com/package/puer) not support post, respond files without extension as `application/octet-stream`

- [anywhere](https://www.npmjs.com/package/anywhere) not support post, and not support reload

- [browsersync](http://www.browsersync.io/) not support post, respond files without extension as `application/octet-stream`

[npm-version-image]: http://img.shields.io/npm/v/serve-here.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/serve-here
[npm-downloads-image]: http://img.shields.io/npm/dm/serve-here.svg?style=flat-square
[license-image]: http://img.shields.io/badge/license-MIT-blue.svg?style=flat-square
[license-url]: LICENSE
[travis-image]: https://img.shields.io/travis/vivaxy/here.svg?style=flat-square
[travis-url]: https://travis-ci.org/vivaxy/here
[david-image]: http://img.shields.io/david/vivaxy/here.svg?style=flat-square
[david-url]: https://david-dm.org/vivaxy/here
[nodei-dl-image]: https://nodei.co/npm-dl/serve-here.png?height=3
[nodei-url]: https://nodei.co/npm/serve-here/
[nodei-image]: https://nodei.co/npm/serve-here.svg?downloads=true&downloadRank=true&stars=true
