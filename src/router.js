'use strict';

const parseURL = require('@chickendinosaur/url/parse');

const Route = require('./utils/route');
const RouteTreeNode = require('./utils/route-tree-node');
const ParamInfo = require('./utils/param-info');

var _routeTreeRoot = new RouteTreeNode(); // Tree sorted by router expression chunks.
var _routeParamInfoCache = {}; // RouteTreeNode look-up cache by route expression.
var _routeTreeNodeCache = {}; // Route param info look-up cache by route expression.
var _currRoute = null;

/**
@method Router
 */
function Router (req, res) {
  var method = req.method;
  var parsedUrl = parseURL(req.url);

  // Parse URL pathname.
  var urlChunks = Router._generateUrlChunks(parsedUrl.pathname);

  Router._findRoute(_routeTreeRoot, method, urlChunks);
}

Router._routeTreeRoot = _routeTreeRoot;
Router._routeParamInfoCache = _routeParamInfoCache;
Router._routeTreeNodeCache = _routeTreeNodeCache;

/**
Parses the route tree to find a matching route.
If not route match is found the root

@method _findRoute
 */
Router._findRoute = function (routeTreeNode, method, urlChunks) {
  // Look for a URL match in the param tree.
  var i = -1;
  var n = urlChunks.length;

  // Attempt to locate route.
  while (++i < n) {
    if (routeTreeNode.nodes !== null) {
      break;
    }

    routeTreeNode = routeTreeNode.nodes[urlChunks[i]];
  }

  // Check if the url has a route node.
  // If it does, return the matching route, otherwise return undefined.
  if (i - 1 === n) {
    return routeTreeNode.routes[method];
  }

  return undefined;
};

/**
@method _generateUrlChunks
 */
Router._generateUrlChunks = function (pathname) {
  var result = null;
  var slashChar = '/';

  // Normalize slashes.
  pathname = pathname.replace(/\/+/g, slashChar);

  // Remove last slash if exists and it's not the only part of the route.
  var routeExpLen = pathname.length;
  if (routeExpLen > 1) {
    var firstChar = pathname.charAt(0);
    var lastChar = pathname.charAt(routeExpLen - 1);

    if (firstChar === slashChar &&
      lastChar === slashChar) {
      pathname = pathname.substring(1, routeExpLen - 1);
    } else if (firstChar === slashChar) {
      pathname = pathname.substring(1);
    } else if (lastChar === slashChar) {
      pathname = pathname.substring(0, routeExpLen - 1);
    }
  }

  firstChar = pathname.charAt(0);
  if (firstChar === slashChar ||
    firstChar === '') {
    result = ['*'];
  } else {
    result = pathname.split('/');
  }

  return result;
};

/**
@method _handle
 */
Router._handle = function () {
  var route = _currRoute.routeTreeNode.routes[_currRoute.method];

  if (route === undefined) {
    _currRoute.handlers = arguments;
    _currRoute.routeTreeNode.routes[_currRoute.method] = _currRoute;
  } else {
    route.handlers = arguments;
  }
};

/**
@method _use
 */
const useAPIChainLink = {
  handle: Router._handle
};

Router._use = function () {
  _currRoute.middleware = arguments;
  _currRoute.routeTreeNode.routes[_currRoute.method] = _currRoute;

  return useAPIChainLink;
};

/**
@method _route
 */
const routeAPIChainLink = {
  use: Router._use,
  handle: Router._handle
};

Router._route = function (routeExp) {
  var routeParamInfo = _routeParamInfoCache[routeExp];
  var routeTreeNode = null;

  if (routeParamInfo === undefined) {
    var routeExpChunks = Router._generateUrlChunks(routeExp);
    var routeChunk = null;
    var i = -1;
    var n = routeExpChunks.length;

    routeTreeNode = _routeTreeRoot;

    // Check for params of route expression.
    if (routeExp.indexOf(':') >= 0) {
      routeParamInfo = [];
    }

    // Insert route config into route tree.
    // Iterate from top of the tree -> down.
    while (++i < n) {
      routeChunk = routeExpChunks[i];

      if (routeTreeNode.nodes === null) {
        routeTreeNode.nodes = {};
      }

      switch (routeChunk.charAt(0)) {
      // Check for param key.
      case ':':
        if (routeTreeNode.nodes[':'] === undefined) {
          routeTreeNode.nodes[':'] = new RouteTreeNode();
        }

        routeTreeNode = routeTreeNode.nodes[':'];

        routeParamInfo.push(new ParamInfo(routeChunk.substring(1), i));
        break;
      // Static params.
      default:
        // Generate a static param map to lookup possible matches.
        if (routeTreeNode.nodes[routeChunk] === undefined) {
          routeTreeNode.nodes[routeChunk] = new RouteTreeNode();
        }

        routeTreeNode = routeTreeNode.nodes[routeChunk];
      }
    }

    // Cache route param info by route expression.
    _routeParamInfoCache[routeExp] = routeParamInfo;
    // Cache tree node by route expression.
    _routeTreeNodeCache[routeExp] = routeTreeNode;
  } else {
    routeTreeNode = _routeTreeNodeCache[routeExp];
  }

  // Set param info on current route.
  _currRoute.paramInfo = routeParamInfo;

  // Set current route tree node reference.
  _currRoute.routeTreeNode = routeTreeNode;

  return routeAPIChainLink;
};

/**
@method get
*/
Router.get = function (routeExp) {
  _currRoute = new Route('GET');

  return Router._route(routeExp);
};

/**
@method post
*/
Router.post = function (routeExp) {
  _currRoute = new Route('POST');

  return Router._route(routeExp);
};

/**
@method put
*/
Router.put = function (routeExp) {
  _currRoute = new Route('PUT');

  return Router._route(routeExp);
};

/**
@method delete
*/
Router.delete = function (routeExp) {
  _currRoute = new Route('DELETE');

  return Router._route(routeExp);
};

/**
@method head
*/
Router.head = function (routeExp) {
  _currRoute = new Route('HEAD');

  return Router._route(routeExp);
};

module.exports = Router;
