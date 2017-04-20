'use strict';

const tape = require('tape');
const tapes = require('tapes');
const test = tapes(tape, {
  delimiter: '->'
});

/*
Setup
*/

const generateUrlChunks = require('../src/generate-url-chunks');

var testPathname = '///a/b//c//';
var testPathnameSingleSlash = '/';
var pathChunks = null;

/*
Test
*/

test('router/generate-url-chunks', function (t) {
  t.beforeEach(function (t) {
    t.end();
  });

  t.afterEach(function (t) {
    pathChunks = null;
    t.end();
  });

  t.test('Parse dirty pathname.', function (t) {
    pathChunks = generateUrlChunks(testPathname);

    t.equal(pathChunks[0], 'a', 'First character is not a slash.');
    t.equal(pathChunks[pathChunks.length - 1], 'c', 'Last character is not a slash.');
    t.end();
  });

  t.test('Parse single character slash pathChunks.', function (t) {
    pathChunks = generateUrlChunks(testPathnameSingleSlash);

    t.equal(pathChunks[0], '*', 'First index is wildcard token when using only slash.');
    t.equal(pathChunks.length, 1, 'Maintains a length of one.');
    t.end();
  });

  t.end();
});
