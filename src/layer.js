'use strict';

module.exports = Layer;

function Layer (paramTreeNode, timeout) {
  this._middleware = null;
  this._timeout = timeout || 30;
}

Layer.prototype.next = () => {};
