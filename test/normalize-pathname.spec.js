'use strict';

const tape = require('tape');
const tapes = require('tapes');
const test = tapes(tape, {
	delimiter: '->'
});

/*
Setup
*/

const normalizePathname = require('../src/normalize-pathname');

var testPathname = '///a/b//c//';
var testPathnameSingleSlash = '/';
var pathname = null;

/*
Test
*/

test('router/normalize-pathname', function (t) {
	/*
	beforeEach
	*/

	t.beforeEach(function (t) {
		t.end();
	});

	/*
	afterEach
	*/

	t.afterEach(function (t) {
		pathname = null;
		t.end();
	});

	/*
	Tests
	*/

	t.test('Parse dirty pathname.', function (t) {
		pathname = normalizePathname(testPathname);

		t.equal(pathname.indexOf('//'), -1, 'Only single slashes exist.');
		t.notEqual(pathname.charAt(0), '/', 'First character is not a slash.');
		t.notEqual(pathname.charAt(pathname.length - 1), '/', 'Last character is not a slash.');
		t.end();
	});

	t.test('Parse single character slash pathname.', function (t) {
		pathname = normalizePathname(testPathnameSingleSlash);

		t.equal(pathname.charAt(0), '/', 'Keeps slash.');
		t.equal(pathname.length, 1, 'Maintains a length of one.');
		t.end();
	});

	t.end();
});
