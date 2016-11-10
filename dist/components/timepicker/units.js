'use strict';

exports.__esModule = true;

var _time_units = require('./time_units');

var _time_units2 = _interopRequireDefault(_time_units);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = Object.keys(_time_units2.default).map(function (k) {
  return { value: k, label: _time_units2.default[k] };
});
module.exports = exports['default'];