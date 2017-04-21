'use strict';

module.exports = function ParamInfo (name, index) {
  // Property/variable name.
  this.name = name;

  // Used to access the index of the split incoming route.
  this.index = index;
};
