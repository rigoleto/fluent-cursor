"use strict";

/* @flow */

var Immutable = require("immutable");

function FluentArrayCursor(array) {
  this.immutable = Immutable.fromJS(array);
}
FluentArrayCursor.prototype = {
  concat: function (otherArray) {},

  pop: function () {},

  push: function (item) {},

  shift: function (item) {},

  unshift: function () {},

  reverse: function () {},

  sort: function () {},

  splice: function () {}
};

function FluentObjectCursor(object) {
  var self = this;
  var identityMap = {};
  var immutable = Immutable.fromJS(object);
  Object.defineProperty(this, "immutable", {
    value: immutable
  });

  var properties = immutable.keys().map(function (k) {
    return {
      k: {
        get: function () {
          var v = immutable.get(k);
          if (Immutable.Map.isMap(v)) {
            if (!identityMap[k]) {
              identityMap[k] = new FluentCursor(v);
            }
            return identityMap[k];
          } else {
            return v;
          }
        },
        set: function (v) {
          delete identityMap[k];
          immutable = immutable.set(k, v);
        },
        enumerable: true
      }
    };
  });

  Object.defineProperties(this, properties);
}

function FluentCursor(structure) {
  if (Array.isArray(structure)) {
    FluentArrayCursor.call(this, structure);
  } else {
    FluentObjectCursor.call(this, structure);
  }
}


module.exports = FluentCursor;