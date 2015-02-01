/**
 * @since 150130 17:29
 * @author vivaxy
 */
var fs = require('fs');
var http = require('http');
var exec = require('child_process').exec;
var mime = require('./mime');
var path = require('path');
var url = require('url');

var serve = function () {

  var server = http.createServer(function (req, res) {
    console.log(req.url);

    var pathname = url.parse(req.url).pathname;
    var query = url.parse(req.url).query;

    var extension = path.extname(pathname);

    fs.readFile(path.join(process.cwd(), pathname), function (err, data) {
      if (err) {
        res.writeHead(404);
        res.end(JSON.stringify(err));
        return;
      }
      res.writeHead(200, {
        'Content-Type': mime[extension] || 'application/json; charset=utf-8'
      });
      res.end(data);
    });

  });

  server.on('error', function (e) {
    if (e.code == 'EADDRINUSE') {
      console.log('\x1b[31mport in use!\x1b[0m');
      process.exit(1);
    } else {
      //console.log(e);
    }
  });

  server.listen(8080, function () {
    console.log('\x1b[32mserver started at http://127.0.0.1:8080/\x1b[0m');
    exec('open http://127.0.0.1:8080/');
  });

};

exports = module.exports = serve;