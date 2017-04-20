'use strict';

module.exports = Layer;

function Layer (, timeout) {
  this._middleware = middleware || null;
  this._timeout = timeout || 30;
}

Layer.prototype.next = () => {};
