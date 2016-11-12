'use strict';

exports.__esModule = true;

var _header = require('./components/header/header');

var _header2 = _interopRequireDefault(_header);

var _picker = require('./components/timepicker/picker');

var _picker2 = _interopRequireDefault(_picker);

var _config = require('./components/timepicker/config');

var _config2 = _interopRequireDefault(_config);

var _interval_config = require('./components/timepicker/interval_config');

var _interval_config2 = _interopRequireDefault(_interval_config);

var _config_panel = require('./components/header/config_panel');

var _config_panel2 = _interopRequireDefault(_config_panel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  Header: _header2.default,
  Timepicker: _picker2.default,
  TimepickerConfig: _config2.default,
  IntervalConfig: _interval_config2.default,
  ConfigPanel: _config_panel2.default
};
module.exports = exports['default'];