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

	t.test('.route', function (t) {
		Router.route('/a/:id/b');
		t.notEqual(Router._routeParamTree.staticNodes['a'], undefined, 'Created static param tree node.');
		t.notEqual(Router._routeParamTree.staticNodes['a'].dynamicNode, null, 'Created dynamic param tree node.');
		t.notEqual(Router._routeInfos['/a/:id/b'], undefined, 'Created a route info.');
		t.equal(Router._routeInfos['/a/:id/b'].paramNodes[0].name, 'id', 'Stored param name in generated route info.');
		t.equal(Router._routeInfos['/a/:id/b'].paramNodes[0].index, 1, 'Stored index of param in url.');
		t.end();
	});

	t.end();
});
