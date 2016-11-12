'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _react2.default.createClass({
  displayName: 'config_panel',
  handleClose: function handleClose() {
    if (_lodash2.default.isFunction(this.props.onClose)) {
      this.props.onClose();
    }
  },
  render: function render() {
    if (!this.props.show) return _react2.default.createElement('div', { style: { display: 'none' } });
    return _react2.default.createElement(
      'div',
      { className: 'kbnUIConfigPanel' },
      _react2.default.createElement(
        'div',
        { className: 'kbnUIConfigPanel__body' },
        this.props.children
      ),
      _react2.default.createElement(
        'div',
        { className: 'kbnUIConfigPanel__control' },
        _react2.default.createElement('i', { className: 'fa fa-chevron-up',
          onClick: this.handleClose })
      )
    );
  }
});
module.exports = exports['default'];