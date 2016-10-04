module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	exports.propsToStyles = propsToStyles;

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _humps = __webpack_require__(2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	/**
	 * Maps an object to CSS variables by transforming the key according to the CSS specification.
	 *
	 * @method propsToStyles
	 * @param {Object} props
	 * @return {String}
	 */
	function propsToStyles(props) {

	    return '' + Object.keys(props).map(function (key) {
	        var name = (0, _humps.decamelize)(key, { separator: '-' });
	        return '--' + name + ': ' + props[key] + '; ';
	    }).join('').trim();
	}

	/**
	 * @author Adam Timberlake
	 * @class Interpose
	 * @extends Component
	 */

	var Interpose = function (_Component) {
	    _inherits(Interpose, _Component);

	    function Interpose() {
	        _classCallCheck(this, Interpose);

	        return _possibleConstructorReturn(this, Object.getPrototypeOf(Interpose).apply(this, arguments));
	    }

	    _createClass(Interpose, [{
	        key: 'componentWillMount',


	        /**
	         * @method componentWillMount
	         * @return {void}
	         */


	        /**
	         * @constant defaultProps
	         * @type {Object}
	         */
	        value: function componentWillMount() {
	            this.styleElement = document.createElement('style');
	        }

	        /**
	         * Determine the selector name based on the node's attributes as defined in the `attributes` constant.
	         *
	         * @method propsToSelector
	         * @param {Object} props
	         * @return {String}
	         */


	        /**
	         * @constant attributes
	         * @type {Array}
	         */


	        /**
	         * @constant propTypes
	         * @type {Object}
	         */

	    }, {
	        key: 'propsToSelector',
	        value: function propsToSelector(props) {
	            var children = this.props.children;


	            var selector = this.props.isRoot ? ':root' : Interpose.attributes.reduce(function (accumulator, model) {
	                var hasAttr = children.props[model.attr];
	                return hasAttr ? '' + accumulator + model.symbol + children.props[model.attr] : accumulator;
	            }, children.type);

	            return (selector + ' { ' + propsToStyles(props) + ' }').trim();
	        }

	        /**
	         * @method render
	         * @return {XML}
	         */

	    }, {
	        key: 'render',
	        value: function render() {
	            var _this2 = this;

	            var child = _react2.default.Children.only(this.props.children);

	            return (0, _react.cloneElement)(child, { ref: function ref(childElement) {

	                    if (childElement) {

	                        _this2.styleElement.setAttribute('type', 'text/css');
	                        _this2.styleElement.innerHTML = _this2.propsToSelector(_this2.props.map);
	                        childElement.insertBefore(_this2.styleElement, childElement.childNodes[0]);
	                    }
	                } });
	        }
	    }]);

	    return Interpose;
	}(_react.Component);

	Interpose.propTypes = {
	    map: _react.PropTypes.object.isRequired,
	    children: _react.PropTypes.node.isRequired,
	    isRoot: _react.PropTypes.bool
	};
	Interpose.defaultProps = {
	    isRoot: false
	};
	Interpose.attributes = [{ attr: 'id', symbol: '#' }, { attr: 'className', symbol: '.' }];
	exports.default = Interpose;

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = require("react");

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';

	// =========
	// = humps =
	// =========
	// Underscore-to-camelCase converter (and vice versa)
	// for strings and object keys

	// humps is copyright © 2012+ Dom Christie
	// Released under the MIT license.


	;(function (global) {

	  var _processKeys = function _processKeys(convert, obj, options) {
	    if (!_isObject(obj) || _isDate(obj) || _isRegExp(obj) || _isBoolean(obj)) {
	      return obj;
	    }

	    var output,
	        i = 0,
	        l = 0;

	    if (_isArray(obj)) {
	      output = [];
	      for (l = obj.length; i < l; i++) {
	        output.push(_processKeys(convert, obj[i], options));
	      }
	    } else {
	      output = {};
	      for (var key in obj) {
	        if (obj.hasOwnProperty(key)) {
	          output[convert(key, options)] = _processKeys(convert, obj[key], options);
	        }
	      }
	    }
	    return output;
	  };

	  // String conversion methods

	  var separateWords = function separateWords(string, options) {
	    options = options || {};
	    var separator = options.separator || '_';
	    var split = options.split || /(?=[A-Z])/;

	    return string.split(split).join(separator);
	  };

	  var camelize = function camelize(string) {
	    if (_isNumerical(string)) {
	      return string;
	    }
	    string = string.replace(/[\-_\s]+(.)?/g, function (match, chr) {
	      return chr ? chr.toUpperCase() : '';
	    });
	    // Ensure 1st char is always lowercase
	    return string.substr(0, 1).toLowerCase() + string.substr(1);
	  };

	  var pascalize = function pascalize(string) {
	    var camelized = camelize(string);
	    // Ensure 1st char is always uppercase
	    return camelized.substr(0, 1).toUpperCase() + camelized.substr(1);
	  };

	  var decamelize = function decamelize(string, options) {
	    return separateWords(string, options).toLowerCase();
	  };

	  // Utilities
	  // Taken from Underscore.js

	  var toString = Object.prototype.toString;

	  var _isObject = function _isObject(obj) {
	    return obj === Object(obj);
	  };
	  var _isArray = function _isArray(obj) {
	    return toString.call(obj) == '[object Array]';
	  };
	  var _isDate = function _isDate(obj) {
	    return toString.call(obj) == '[object Date]';
	  };
	  var _isRegExp = function _isRegExp(obj) {
	    return toString.call(obj) == '[object RegExp]';
	  };
	  var _isBoolean = function _isBoolean(obj) {
	    return toString.call(obj) == '[object Boolean]';
	  };

	  // Performant way to determine if obj coerces to a number
	  var _isNumerical = function _isNumerical(obj) {
	    obj = obj - 0;
	    return obj === obj;
	  };

	  // Sets up function which handles processing keys
	  // allowing the convert function to be modified by a callback
	  var _processor = function _processor(convert, options) {
	    var callback = options && 'process' in options ? options.process : options;

	    if (typeof callback !== 'function') {
	      return convert;
	    }

	    return function (string, options) {
	      return callback(string, convert, options);
	    };
	  };

	  var humps = {
	    camelize: camelize,
	    decamelize: decamelize,
	    pascalize: pascalize,
	    depascalize: decamelize,
	    camelizeKeys: function camelizeKeys(object, options) {
	      return _processKeys(_processor(camelize, options), object);
	    },
	    decamelizeKeys: function decamelizeKeys(object, options) {
	      return _processKeys(_processor(decamelize, options), object, options);
	    },
	    pascalizeKeys: function pascalizeKeys(object, options) {
	      return _processKeys(_processor(pascalize, options), object);
	    },
	    depascalizeKeys: function depascalizeKeys() {
	      return this.decamelizeKeys.apply(this, arguments);
	    }
	  };

	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_FACTORY__ = (humps), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if (typeof module !== 'undefined' && module.exports) {
	    module.exports = humps;
	  } else {
	    global.humps = humps;
	  }
	})(undefined);

/***/ }
/******/ ]);