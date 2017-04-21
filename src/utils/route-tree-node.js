'use strict';

module.exports = function RouteTreeNode () {
  // Route param look-up map.
  // ':' represents dynamic param.
  // '*' represents wildcard.
  this.nodes = null;

  this.staticNodes = null;

  this.dynamicNode = null;

  this.wildcard = false;

  // Request method buckets.
  // Keys are method names ex. 'GET', 'POST' etc.
  this.routes = {};
};
