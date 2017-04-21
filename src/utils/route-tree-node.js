'use strict';

module.exports = function RouteTreeNode () {
  // Route param look-up map.
  // ':' represents dynamic param.
  // '*' represents wildcard.
  this.nodes = null;

  // Keys of nodes cache.
  // Used to recurively add wildcard middleware to all child routes.
  this._nodesKeys = null;

  // Request method buckets.
  // Keys are method names ex. 'GET', 'POST' etc.
  this.routes = {};
};
