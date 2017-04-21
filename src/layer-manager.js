'use strict';

var _layerStack = {};
var _layerStackKeyQueue = [];
var _stackRefCount = -1;

/**
@method _handleRequestDone
*/
function _handleRequestDone (stackPosition) {
  _layerStack[stackPosition] = null;
  _layerStackKeyQueue.push(stackPosition);
}

/**
@method createLayer
*/
function createLayer (req, res, route, paramInfo) {
  var index = null;

  // Find an exmpty slot to use for current layer.
  if (_layerStackKeyQueue.length > 0) {
    index = _layerStackKeyQueue.pop();
  } else {
    index = ++_stackRefCount;
  }

  // Create layer.
  var layer = new Layer(index, route, paramInfo, _handleRequestDone);
  layer.stackPosition = index;

  // Add layer to stack.
  _layerStack[index] = layer;
}

module.exports = {
  addLayer: createLayer
};
