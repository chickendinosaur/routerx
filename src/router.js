'use strict';

const normalizePathname = require('./router');

// Tree sorted by router expression chunks.
var routeTreeRoot = {};

function RouteTreeNode () {}

/**
Storage object.
Used with RouteConfig.
@class ParamNode
@constructor
*/
function ParamNode () {
	this.paramName = null;
	this.paramIndex = null;
}

/**
Storage object.
Contains all functionality for a route expression.
@class RouteConfig
@constructor
*/
function RouteConfig () {
	this.params = [];
	this.methods = null;
	this.middleware = null;
	this.handlers = null;
	this.routeExp = null;
}

// Used as a context to pass collected route expression data across router methods.
var currRouteConfig = null;

/**
 */
function parseRouteExpression (routeExp) {
	// Decode route expression.

	var pathname = normalizePathname(routeExp);
	if (pathname.length === 1) {
		return;
	}

	var routeExpChunks = pathname.split('/');
}

/**
 */
function Router (req, res) {}

/**
 */
Router.on = function (method1, method2) {
	currRouteConfig = new RouteConfig();
	currRouteConfig.methods = arguments;

	return {
		route: Router.route
	};
};

/**
 */
Router.route = function (routeExp) {
	currRouteConfig.routeExp = routeExp;

	// Parse route expression.
	var pathname = normalizePathname(routeExp);

	if (pathname.length === 1) {
		return;
	}

	var routeExpChunks = pathname.split('/');

	return {
		use: Router.use,
		handle: Router.handle
	};
};

/**
 */
Router.use = function (middleware1, middleware2) {
	currRouteConfig.middleware = arguments;

	return {
		handle: Router.handle
	};
};

/**
 */
Router.handle = function (handler1, handler2) {
	currRouteConfig.handlers = arguments;
};

module.exports = Router;
