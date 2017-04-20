'use strict';

const tape = require('tape');
const tapes = require('tapes');
const test = tapes(tape, {
  delimiter: '->'
});

/*
Setup
*/

const Router = require('../src/router');

let middleware1 = function (req, res, next) { next(); };
let middleware2 = function (req, res, next) { next(); };
let handler1 = function (req, res) {};
let handler2 = function (req, res) {};

Router
.on('get')
.route('/a/:id//b//')
.use(middleware1, middleware2)
.handle(handler1, handler2);

/*
Test
*/

test('router', function (t) {
  t.beforeEach(function (t) {
    t.end();
  });

  t.afterEach(function (t) {
    t.end();
  });

  t.test('._route', function (t) {
    let paramTreeNode = Router._routeParamTree;

    t.notEqual(paramTreeNode.nodes['a'], undefined, 'Created static param tree node.');
    t.notEqual(paramTreeNode.nodes['a'].nodes[':'], undefined, 'Created dynamic param tree node.');
    t.notEqual(paramTreeNode.nodes['a'].nodes[':'].nodes['b'], undefined, 'Ceated static node from dynamic node.');
    t.equal(paramTreeNode.nodes['a'].nodes[':'].nodes['b'].paramInfo[0].name, 'id', 'Stored param name in generated route info.');
    t.equal(paramTreeNode.nodes['a'].nodes[':'].nodes['b'].paramInfo[0].index, 1, 'Stored index of param in url.');
    t.end();
  });

  t.test('._use', function (t) {
    let paramTreeNode = Router._routeParamTree;

    t.equal(paramTreeNode.nodes['a'].nodes[':'].nodes['b'].routeConfigs['GET'].middleware.length, 2, 'Middleware added..');
    t.end();
  });

  t.test('._handle', function (t) {
    let paramTreeNode = Router._routeParamTree;

    t.equal(paramTreeNode.nodes['a'].nodes[':'].nodes['b'].routeConfigs['GET'].handlers.length, 2, 'Handlers added..');
    t.end();
  });

  t.test('.on', function (t) {
    let paramTreeNode = Router._routeParamTree;

    t.notEqual(paramTreeNode.nodes['a'].nodes[':'].nodes['b'].routeConfigs['GET'], undefined, 'Request method type transformed to uppercase.');
    t.end();
  });

  t.end();
});
