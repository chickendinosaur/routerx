'use strict';

/**
Used to pass information across the Router API when defining routes.

@class RouteCreationContext
@constructor
*/
module.exports = function RouteCreationContext () {
  this.requestMethod = '*';
  this.paramTreeNode = null;
};
