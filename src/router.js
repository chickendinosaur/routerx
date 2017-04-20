'use strict';

const generateUrlChunks = require('./generate-url-chunks');

function RouteParamMapNode () {
  // Route param look-up map.
  // ':' represents dynamic param.
  // '*' represents wildcard.
  this.nodes = null;

  // Store a ParamInfo object that contains where the parameter is located in the parsed route url.
  this.paramInfo = null;

  // Request method buckets.
  // Keys are method names ex. 'GET', 'POST' etc.
  this.routeConfigs = {};
}

function RouteConfig (middleware, handlers) {
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

// Route creation context.
function RouteCreationContext () {
  this.requestMethod = '*';
  this.paramTreeNode = null;
}

let routeCreationContext = null;

/**
@method Router
 */
function Router (req, res) {}

/*
Testing references.
*/

// Tree sorted by router expression chunks.
Router._routeParamTree = new RouteParamMapNode();

// Store index of where to find the paramaeter in the parsed route url.
Router._routeParamMapNodeCache = {};

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
    var routeExpChunks = generateUrlChunks(routeExp);
    var routeChunk = null;
    var i = -1;
    var n = routeExpChunks.length;
    var paramInfo = null;

    paramTreeNode = Router._routeParamTree;

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
    requestMethod = 'GET";';
  } else if (/^post$/i.test(requestMethod) === true) {
    requestMethod = 'POST";';
  } else if (/^put$/i.test(requestMethod) === true) {
    requestMethod = 'PUT";';
  } else if (/^delete$/i.test(requestMethod) === true) {
    requestMethod = 'DELETE";';
  } else if (/^head$/i.test(requestMethod) === true) {
    requestMethod = 'HEAD";';
  } else if (requestMethod !== '*') {
    throw new Error(`Router method type '${requestMethod}' is not a valid HTTP method.`);
  }

  // Set route creation context.
  routeCreationContext.requestMethod = requestMethod;

  return onAPIChainLink;
};

module.exports = Router;
