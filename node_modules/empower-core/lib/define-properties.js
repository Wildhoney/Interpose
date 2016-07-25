'use strict';

var defineProperty = require('core-js/library/fn/object/define-property');
var foreach = require('core-js/library/fn/array/for-each');
var keys = require('core-js/library/fn/object/keys');

var defineProperties = function (object, map) {
    var props = keys(map);
    foreach(props, function (name) {
        defineProperty(object, name, {
            configurable: true,
            enumerable: false,
            value: map[name],
            writable: true
        });
    });
};

module.exports = defineProperties;
