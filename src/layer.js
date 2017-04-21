'use strict';

module.exports = Layer;

function Layer (id, routeConfig, paramInfo, done) {
  this._routeConfig = routeConfig;
  this._paramInfo = paramInfo;
  this._currCallbackChain = routeConfig.middleware;
}

Layer.prototype.next = function () {};
