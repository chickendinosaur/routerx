'use strict';

module.exports = function RouteConfig (middleware, handlers) {
  // Middleware callback stack.
  this.middleware = middleware;

  // Handler stack
  this.handlers = handlers;
};
