'use strict';

const tape = require('tape');
const tapes = require('tapes');
const test = tapes(tape, {
  delimiter: '.'
});

/*
Setup
*/

const Router = require('../src/router');
const Route = require('../src/utils/route');

let middleware1 = function (req, res, next) { next(); };
let middleware2 = function (req, res, next) { next(); };
let asyncMiddleware1 = function (req, res, next) { next(); };
let asyncMiddleware2 = function (req, res, next) { next(); };
let handler = function (req, res) {};
let asyncHandler1 = function (req, res) {};
let asyncHandler2 = function (req, res) {};

var testPathname = '///a/:id//b//';
var testPathnameSingleSlash = '/';
var testURL = 'a/1/b';
var testURLChunks = testURL.split('/');

Router
.get(testPathname)
.use(middleware1, [asyncMiddleware1, asyncMiddleware2], middleware2)
.handle(handler, [asyncHandler1, asyncHandler2]);

/*
Test
*/

test('Router', function (t) {
  t.beforeEach(function (t) {
    t.end();
  });

  t.afterEach(function (t) {
    t.end();
  });

  t.test('_generateUrlChunks', function (t) {
    var pathChunks = Router._generateUrlChunks(testPathname);
    t.equal(pathChunks[0], 'a', 'First character is not a slash.');
    t.equal(pathChunks[pathChunks.length - 1], 'b', 'Last character is not a slash.');

    pathChunks = Router._generateUrlChunks(testPathnameSingleSlash);
    t.equal(pathChunks[0], '*', 'First index is wildcard token when using only slash.');
    t.equal(pathChunks.length, 1, 'Maintains a length of one.');
    t.end();
  });

  t.test('_route', function (t) {
    let paramTreeNode = Router._routeTreeRoot;

    t.notEqual(paramTreeNode.nodes['a'], undefined, 'Created static param tree node.');
    t.notEqual(paramTreeNode.nodes['a'].nodes[':'], undefined, 'Created dynamic param tree node.');
    t.notEqual(paramTreeNode.nodes['a'].nodes[':'].nodes['b'], undefined, 'Ceated static node from dynamic node.');
    t.equal(paramTreeNode.nodes['a'].nodes[':'].nodes['b'].routes['GET'].paramInfo[0].name, 'id', 'Stored param name in generated route info.');
    t.equal(paramTreeNode.nodes['a'].nodes[':'].nodes['b'].routes['GET'].paramInfo[0].index, 1, 'Stored index of param in url.');
    t.end();
  });

  t.test('_use', function (t) {
    let paramTreeNode = Router._routeTreeRoot;

    t.equal(paramTreeNode.nodes['a'].nodes[':'].nodes['b'].routes['GET'].middleware.length, 3, 'Middleware added..');
    t.end();
  });

  t.test('_handle', function (t) {
    let paramTreeNode = Router._routeTreeRoot;

    t.equal(paramTreeNode.nodes['a'].nodes[':'].nodes['b'].routes['GET'].handlers.length, 2, 'Handlers added..');
    t.end();
  });

  t.test('.on', function (t) {
    let paramTreeNode = Router._routeTreeRoot;

    t.notEqual(paramTreeNode.nodes['a'].nodes[':'].nodes['b'].routes['GET'], undefined, 'Request method type transformed to uppercase.');
    t.end();
  });

  t.test('_findRoute', function (t) {
    t.equal(Router._findRoute('GET', testURLChunks), Route, 'Stored index of param in url.');
    t.end();
  });

  t.end();
});
