'use strict';

exports.__esModule = true;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _picker = require('../timepicker/picker');

var _picker2 = _interopRequireDefault(_picker);

var _config = require('../timepicker/config');

var _config2 = _interopRequireDefault(_config);

var _interval_config = require('../timepicker/interval_config');

var _interval_config2 = _interopRequireDefault(_interval_config);

var _config_panel = require('./config_panel');

var _config_panel2 = _interopRequireDefault(_config_panel);

var _color = require('color');

var _color2 = _interopRequireDefault(_color);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _react2.default.createClass({
  displayName: 'header',
  getInitialState: function getInitialState() {
    return {
      showTimepicker: false,
      showInterval: false
    };
  },
  componentWillReceiveProps: function componentWillReceiveProps(props) {
    if (props.config) {
      this.setState({
        showTimepicker: false,
        showInterval: false
      });
    }
  },
  handleConfigClose: function handleConfigClose() {
    this.setState({
      showTimepicker: false,
      showInterval: false
    });
    if (_lodash2.default.isFunction(this.props.onConfigClose)) {
      this.props.onConfigClose();
    }
  },
  handleTimepickerClick: function handleTimepickerClick() {
    if (_lodash2.default.isFunction(this.props.onConfigClose)) {
      this.props.onConfigClose();
    }
    this.setState({ showInterval: false, showTimepicker: !this.state.showTimepicker });
  },
  handleTimepickerChange: function handleTimepickerChange(timefilter) {
    if (_lodash2.default.isFunction(this.props.onTimepickerChange)) {
      this.props.onTimepickerChange(timefilter);
    }
    this.setState({ showTimepicker: !this.state.showTimepicker });
  },
  handleIntervalClick: function handleIntervalClick() {
    if (_lodash2.default.isFunction(this.props.onConfigClose)) {
      this.props.onConfigClose();
    }
    this.setState({ showTimepicker: false, showInterval: !this.state.showInterval });
  },
  handleTimepickerPause: function handleTimepickerPause(paused) {
    if (_lodash2.default.isFunction(this.props.onPause)) {
      this.props.onPause(paused);
    }
  },
  handleIntervalChange: function handleIntervalChange(interval) {
    if (_lodash2.default.isFunction(this.props.onIntervalChange)) {
      this.props.onIntervalChange(interval);
    }
    this.setState({ showInterval: !this.state.showInterval });
  },
  render: function render() {
    var _props = this.props,
        details = _props.details,
        backgroundColor = _props.backgroundColor;

    var config = void 0;
    if (this.props.config) {
      config = this.props.config;
    } else if (this.state.showTimepicker) {
      config = _react2.default.createElement(_config2.default, { app: this.props.app, onChange: this.handleTimepickerChange });
    } else if (this.state.showInterval) {
      config = _react2.default.createElement(_interval_config2.default, { onChange: this.handleIntervalChange });
    }
    var style = { backgroundColor: backgroundColor };
    var className = 'kbnUIHeader';
    if (backgroundColor && (0, _color2.default)(backgroundColor).luminosity() < 0.45) {
      className = 'kbnUIHeader reversed';
    }
    return _react2.default.createElement(
      'div',
      { style: style, className: className },
      _react2.default.createElement(
        'div',
        { className: 'kbnUIHeader__content' },
        this.props.children,
        _react2.default.createElement(_picker2.default, {
          refresh: this.props.app.refresh,
          timefilter: this.props.app.timefilter,
          onPause: this.handleTimepickerPause,
          onIntervalClick: this.handleIntervalClick,
          onPickerClick: this.handleTimepickerClick })
      ),
      _react2.default.createElement(
        _config_panel2.default,
        { show: config ? true : false, onClose: this.handleConfigClose },
        config
      )
    );
  }
});
module.exports = exports['default'];