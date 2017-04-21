'use strict';

module.exports = function RouteParamMapNode () {
  // Route param look-up map.
  // ':' represents dynamic param.
  // '*' represents wildcard.
  this.nodes = null;

  // Store a ParamInfo object that contains where the parameter is located in the parsed route url.
  this.paramInfo = null;

  // Request method buckets.
  // Keys are method names ex. 'GET', 'POST' etc.
  this.routeConfigs = {};
};
