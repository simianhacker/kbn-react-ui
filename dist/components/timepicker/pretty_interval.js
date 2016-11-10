'use strict';

exports.__esModule = true;

var _time_units = require('./time_units');

var _time_units2 = _interopRequireDefault(_time_units);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (refresh) {
  return refresh.value + ' ' + _time_units2.default[refresh.unit];
};

module.exports = exports['default'];