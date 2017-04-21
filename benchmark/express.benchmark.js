require('lodash');
const Benchmark = require('benchmark');
const suite = new Benchmark.Suite();
const isBrowser = typeof window === 'object';

if (isBrowser) {
  window.Benchmark = Benchmark;
}

/*
Setup
*/

var express = require('express');
var querystring = require('querystring');
var router = express.Router();

var request = {
  method: 'GET',
  url: 'http://www.github.com/products/1/2?p1=11&p2=22',
  _parsedUrl: {
    protocol: 'http:',
    slashes: true,
    auth: null,
    host: 'www.github.com',
    port: null,
    hostname: 'www.github.com',
    hash: null,
    search: '?p1=11&p2=22',
    query: 'p1=11&p2=22',
    pathname: '/products/1/2',
    path: '/products/1/2?p1=11&p2=22',
    href: 'http://www.github.com/products/1/2?p1=11&p2=22'
  }
};

router.use(function (req, event, next) { req.query = querystring.parse(req._parsedUrl.query); next(); });
router.get('/products/:category/:id', function (req, res) {});

/*
Benchmark
*/

suite
.add('Define route.', function () {
  router.use(function (req, event, next) { next(); });
  router.get('/products/:category/:id', function (req, res) {});
})
.add('Navigate.', function () {
  router(request);
})
.on('cycle', function (event) {
  var output = String(event.target);
  output = output.substring(0, output.indexOf('ops/sec') + 7);
  console.log('\x1b[33m%s\x1b[0m', output);
})
.on('complete', function () {
  if (isBrowser) {
    window.close();
  }
})
// Run async
.run({
  'async': false
});
