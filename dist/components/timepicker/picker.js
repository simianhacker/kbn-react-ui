'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _config_panel = require('../header/config_panel');

var _config_panel2 = _interopRequireDefault(_config_panel);

var _pretty_durration = require('./pretty_durration');

var _pretty_durration2 = _interopRequireDefault(_pretty_durration);

var _pretty_interval = require('./pretty_interval');

var _pretty_interval2 = _interopRequireDefault(_pretty_interval);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _react2.default.createClass({
  displayName: 'picker',
  handlePauseClick: function handlePauseClick() {
    var refresh = this.props.refresh;

    if (_lodash2.default.isFunction(this.props.onPause)) {
      this.props.onPause(!refresh.paused);
    }
  },
  handlePickerClick: function handlePickerClick() {
    if (_lodash2.default.isFunction(this.props.onPickerClick)) {
      this.props.onPickerClick();
    }
  },
  handleIntervalClick: function handleIntervalClick() {
    if (_lodash2.default.isFunction(this.props.onIntervalClick)) {
      this.props.onIntervalClick();
    }
  },
  render: function render() {
    var _props = this.props,
        refresh = _props.refresh,
        timefilter = _props.timefilter;

    var pauseClass = refresh.paused ? 'fa fa-play' : 'fa fa-pause';
    var timefilterLabel = void 0;
    if (timefilter.mode === 'relative') {
      timefilterLabel = (0, _pretty_durration2.default)(timefilter.from, timefilter.to);
    } else {
      timefilterLabel = (0, _pretty_durration2.default)((0, _moment2.default)(timefilter.from), (0, _moment2.default)(timefilter.to));
    }
    var intervalLabel = (0, _pretty_interval2.default)(refresh);
    return _react2.default.createElement(
      'div',
      { className: 'kbnUITimepicker' },
      _react2.default.createElement(
        'div',
        { className: 'kbnUITimepicker__refresh' },
        _react2.default.createElement('i', { className: pauseClass, onClick: this.handlePauseClick }),
        _react2.default.createElement(
          'div',
          { className: 'kbnUITimepicker__refresh-label', onClick: this.handleIntervalClick },
          intervalLabel
        )
      ),
      _react2.default.createElement(
        'div',
        { className: 'kbnUITimepicker__pick' },
        _react2.default.createElement('i', { className: 'fa fa-clock-o' }),
        _react2.default.createElement(
          'div',
          { className: 'kbnUITimepicker__pick-label', onClick: this.handlePickerClick },
          timefilterLabel
        )
      )
    );
  }
});
module.exports = exports['default'];