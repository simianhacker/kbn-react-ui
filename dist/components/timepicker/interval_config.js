'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var intervals = [[{ value: '5s', label: '5 seconds' }, { value: '10s', label: '10 seconds' }, { value: '30s', label: '30 seconds' }, { value: '45s', label: '45 seconds' }], [{ value: '1m', label: '1 minute' }, { value: '5m', label: '5 minute' }, { value: '15m', label: '15 minute' }, { value: '30m', label: '30 minute' }], [{ value: '1h', label: '1 hour' }, { value: '2h', label: '2 hour' }, { value: '12h', label: '12 hour' }, { value: '1d', label: '1 day' }]];

exports.default = function (props) {
  var handleClick = function handleClick(value) {
    return function (e) {
      e.preventDefault();
      if (props.onChange) {
        props.onChange(value);
      }
    };
  };

  var columns = intervals.map(function (column, index) {
    var rows = column.map(function (row) {
      return _react2.default.createElement(
        'div',
        { key: 'interval-' + row.value, className: 'kbnUITimepicker__interval-item' },
        _react2.default.createElement(
          'a',
          { onClick: handleClick(row.value) },
          row.label
        )
      );
    });
    return _react2.default.createElement(
      'div',
      { key: 'interval-column-' + index, className: 'kbnUITimepicker__interval-column' },
      rows
    );
  });

  return _react2.default.createElement(
    'div',
    { className: 'kbnUITimepicker__interval' },
    columns
  );
};

module.exports = exports['default'];