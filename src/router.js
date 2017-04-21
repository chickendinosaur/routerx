'use strict';

const RouteParamMapNode = require('./utils/route-param-map-node');
const RouteConfig = require('./utils/route-config');
const ParamInfo = require('./utils/param-info');
const RouteCreationContext = require('./utils/route-creation-context');

let routeCreationContext = null;

/**
@method Router
 */
function Router (req, res) {}
Router._routeParamTreeRoot = new RouteParamMapNode(); // Tree sorted by router expression chunks.
Router._routeParamMapNodeCache = {}; // RouteParamMapNode look-up cache by route expression.

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
  let routeConfig = routeCreationContext.paramTreeNode.routeConfigs[routeCreationContext.requestMethod];

  if (routeConfig === undefined) {
    routeCreationContext.paramTreeNode.routeConfigs[routeCreationContext.requestMethod] = new RouteConfig(null, arguments);
  } else {
    routeConfig.handlers = arguments;
  }

  // Free routeCreationContext.
  routeCreationContext = null;
};

/**
@method _use
 */
const useAPIChainLink = {
  handle: Router._handle
};

Router._use = function () {
  routeCreationContext.paramTreeNode.routeConfigs[routeCreationContext.requestMethod] = new RouteConfig(arguments);

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
  var paramTreeNode = Router._routeParamMapNodeCache[routeExp];

  if (paramTreeNode === undefined) {
    var routeExpChunks = Router._generateUrlChunks(routeExp);
    var routeChunk = null;
    var i = -1;
    var n = routeExpChunks.length;
    var paramInfo = null;

    paramTreeNode = Router._routeParamTreeRoot;

    // Insert route config into route tree.
    // Iterate from top of the tree -> down.
    while (++i < n) {
      routeChunk = routeExpChunks[i];

      if (paramTreeNode.nodes === null) {
        paramTreeNode.nodes = {};
      }

      switch (routeChunk.charAt(0)) {
      // Check for param key.
      case ':':
        if (paramTreeNode.nodes[':'] === undefined) {
          paramTreeNode.nodes[':'] = new RouteParamMapNode();
        }

        paramTreeNode = paramTreeNode.nodes[':'];

        if (paramInfo === null) {
          paramInfo = [];
        }

        paramInfo.push(new ParamInfo(routeChunk.substring(1), i));
        break;
      // Static params.
      default:
        // Generate a static param map to lookup possible matches.
        if (paramTreeNode.nodes[routeChunk] === undefined) {
          paramTreeNode.nodes[routeChunk] = new RouteParamMapNode();
        }

        paramTreeNode = paramTreeNode.nodes[routeChunk];
      }
    }

    // Cache the param tree node by route expression.
    paramTreeNode.paramInfo = paramInfo;

    Router._routeParamMapNodeCache[routeExp] = paramTreeNode;
  }

  // Set route creation context.
  routeCreationContext.paramTreeNode = paramTreeNode;

  return routeAPIChainLink;
};

/**
*/
const onAPIChainLink = {
  route: Router._route,
  use: Router._use
};

Router.on = function (requestMethod) {
  routeCreationContext = new RouteCreationContext();

  if (/^get$/i.test(requestMethod) === true) {
    requestMethod = 'GET';
  } else if (/^post$/i.test(requestMethod) === true) {
    requestMethod = 'POST';
  } else if (/^put$/i.test(requestMethod) === true) {
    requestMethod = 'PUT';
  } else if (/^delete$/i.test(requestMethod) === true) {
    requestMethod = 'DELETE';
  } else if (/^head$/i.test(requestMethod) === true) {
    requestMethod = 'HEAD';
  } else if (requestMethod !== '*') {
    throw new Error(`Router method type '${requestMethod}' is not a valid HTTP method.`);
  }

  // Set route creation context.
  routeCreationContext.requestMethod = requestMethod;

  return onAPIChainLink;
};

module.exports = Router;
