'use strict';

const normalizePathname = require('./normalize-pathname');

function RouteParamTreeNode () {
  // Static param name bucket. Object literal of RouteParamTreeNodes.
  this.staticNodes = null;
  // Dynamic param name. RouteParamTreeNode.
  this.dynamicNode = null;
  // Route expression used as key for looking up corresponding route info.
  this.routeExp = null; // ex. /people/:id
}

function RouteInfo () {
  // Store index of where to find the paramaeter in the parsed route url.
  // Shared across request methods.
  this.paramInfos = null;
  // Middleware callback stack.
  this.middleware = null;
  // Handler stack
  this.handlers = null;
}

function ParamInfo (name, index) {
  // Property/variable name.
  this.name = name;
  // Used to access the index of the split incoming route.
  this.index = index;
}

/**
 */
function Router (req, res) {}

// Tree sorted by router expression chunks.
Router._routeParamTree = new RouteParamTreeNode();

// Route expression route info map.
Router._routeExpressionInfos = {};

// Request method routes map.
Router._requestMethodBuckets = {};
// Routes hit on any method request type.
Router._globalRequestBucket = {};

/**
 */
var currRequestMethods = null;
Router.on = function () {
  currRequestMethods = arguments;

  return {
    route: Router.route
  };
};

/**
 */

Router.route = function (routeExp) {
  var routeInfo = Router._routeExpressionInfos[routeExp];
  if (routeInfo === undefined) {
    routeInfo = Router._routeExpressionInfos[routeExp] = new RouteInfo();
    routeInfo.routeExp = routeExp;

    // Generate split pathname.
    var pathname = normalizePathname(routeExp);
    var routeExpChunks = pathname === '/' ? null : pathname.split('/');
    var paramTreeNode = Router._routeParamTree;

    if (routeExpChunks !== null) {
      var routeChunk = null;
      var i = -1;
      var n = routeExpChunks.length;

      // Insert route config into route tree.
      // Iterate from top of the tree -> down.
      while (++i < n) {
        routeChunk = routeExpChunks[i];

        // Check for param key.
        if (routeChunk.charAt(0) === ':') {
          // Since param ids are undetermined, there is nothing to map to.
          if (paramTreeNode.dynamicNode === null) {
            paramTreeNode.dynamicNode = new RouteParamTreeNode();
          }

          paramTreeNode = paramTreeNode.dynamicNode;

          // Generate and store a param info object.
          if (routeInfo.paramInfos === null) {
            routeInfo.paramInfos = [];
          }

          routeInfo.paramInfos.push(new ParamInfo(routeChunk.substring(1), i));
        } else {
          // Generate a static param map to lookup possible matches.
          if (paramTreeNode.staticNodes === null) {
            paramTreeNode.staticNodes = {};
          }

          paramTreeNode = paramTreeNode.staticNodes[routeChunk];

          if (paramTreeNode === undefined) {
            paramTreeNode = Router._routeParamTree.staticNodes[routeChunk] = new RouteParamTreeNode();
          }
        }
      }

      // Set route expression on the matching destination node.
      paramTreeNode.routeExp = routeExp;
    }
  } else {

  }

  // API chain.
  return {
    use: Router.use,
    handle: Router.handle
  };
};

/**
 */
Router.use = function (middleware1, middleware2) {
  return {
    handle: Router.handle
  };
};

/**
 */
Router.handle = function (handler1, handler2) {
};

module.exports = Router;
