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

const Grapnel = require('grapnel');
const router = new Grapnel();

router.get('products/:category/:id', function (req, event, next) { next(); }, function (req) {});

/*
Benchmark
*/

suite
.add('Define route.', function () {
  router.get('products/:category/a', function (req, event, next) { next(); }, function (req) {});
})
.add('Navigate.', function () {
  router.navigate('http://www.github.com/products/1/2?p1=11&p2=22');
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
