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

const router = require('../src/router');

router
.on('get')
.route('products/:category/:id')
.use(function (req, res, next) { next(); })
.handle(function (req) {});

/*
Benchmark
*/

suite
.add('Define route.', function () {
  router.on('get').route('products/:category/:id').use(function (req, res, next) { next(); }).handle(function (req) {});
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
