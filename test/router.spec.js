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

  t.test('._parseRouteExpression', function (t) {
    let paramTreeNode = Router._parseRouteExpression('/a/:id/b/');

    t.notEqual(Router._routeParamTree.nodes['a'], undefined, 'Created static param tree node.');
    t.notEqual(Router._routeParamTree.nodes['a'].nodes[':'], undefined, 'Created dynamic param tree node.');
    t.equal(paramTreeNode.paramInfo[0].name, 'id', 'Stored param name in generated route info.');
    t.equal(paramTreeNode.paramInfo[0].index, 1, 'Stored index of param in url.');
    t.end();
  });

  t.end();
});
