'use strict';

module.exports = function Route (method, route) {
  this.method = method || '*';

  // Route expressiong reference.
  this.route = route || null;

  // Middleware callback stack.
  this.middleware = null;

  // Handler stack
  this.handlers = null;

  // Store a ParamInfo object that contains where the parameter is located in the parsed route url.
  this.paramInfo = null;

  this.paramTreeNode = null;
};
