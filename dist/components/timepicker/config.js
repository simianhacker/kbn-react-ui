'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _datemath = require('@elastic/datemath');

var _datemath2 = _interopRequireDefault(_datemath);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _quick_ranges = require('./quick_ranges');

var _quick_ranges2 = _interopRequireDefault(_quick_ranges);

var _units = require('./units');

var _units2 = _interopRequireDefault(_units);

var _reactSelect = require('react-select');

var _reactSelect2 = _interopRequireDefault(_reactSelect);

var _reactDatetime = require('react-datetime');

var _reactDatetime2 = _interopRequireDefault(_reactDatetime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var format = 'YYYY-MM-DD HH:mm:ss.SSS';

exports.default = _react2.default.createClass({
  displayName: 'config',
  getInitialState: function getInitialState() {
    var app = this.props.app;
    var timefilter = app.timefilter;

    var relativeFrom = 15;
    var relativeUnits = 'm';
    var relativeRound = false;
    var matches = _lodash2.default.isString(timefilter.from) && timefilter.from.match(/^now\-(\d+)([msMhdyw]|ms)(\/)?([msMhdyw]|ms)?/);
    if (timefilter.mode === 'relative' && timefilter.to === 'now' && matches) {
      relativeFrom = Number(matches[1]);
      relativeUnits = matches[2];
      relativeRound = matches[3] != null;
    }
    return {
      panel: 'quick',
      mode: 'relative',
      relativeFrom: relativeFrom,
      relativeUnits: relativeUnits,
      relativeRound: relativeRound,
      absoluteFrom: app.timerange.min.valueOf(),
      absoluteTo: app.timerange.max.valueOf(),
      absoluteToString: app.timerange.max.format(format),
      absoluteFromString: app.timerange.min.format(format)
    };
  },
  renderRelative: function renderRelative() {
    var _this = this;

    var fromString = 'now-' + this.state.relativeFrom + this.state.relativeUnits;
    if (this.state.relativeRound) fromString += '/' + this.state.relativeUnits;

    var fromLabel = _datemath2.default.parse(fromString, 'now').add(1, 'ms') // ugh... off by 1ms
    .format('MMMM Do, YYYY HH:mm:ss.SSS');

    var handleChange = function handleChange() {
      var relativeFrom = _this.refs.relativeFrom.value;
      _this.setState({ relativeFrom: relativeFrom });
    };

    var handleCheckbox = function handleCheckbox() {
      var relativeRound = _this.refs.relativeRound.checked;
      _this.setState({ relativeRound: relativeRound });
    };

    var handleUnit = function handleUnit(value) {
      var relativeUnits = value.value;
      _this.setState({ relativeUnits: relativeUnits });
    };

    var handleClick = function handleClick(e) {
      e.preventDefault();
      _this.setRange(fromString, 'now');
    };

    var options = _units2.default.map(function (u) {
      var label = _lodash2.default.capitalize(u.label);
      return {
        value: u.value,
        label: label + ' ago'
      };
    });

    var unit = _units2.default.find(function (u) {
      return u.value === _this.state.relativeUnits;
    });

    return _react2.default.createElement(
      'div',
      { className: 'kbnUITimepicker__relative' },
      _react2.default.createElement(
        'div',
        { className: 'kbnUITimepicker__relative-column' },
        _react2.default.createElement(
          'div',
          { className: 'kbnUITimepicker__relative-label' },
          'From: ',
          fromLabel
        ),
        _react2.default.createElement(
          'div',
          { className: 'kbnUITimepicker__relative-field' },
          _react2.default.createElement('input', {
            type: 'number',
            onChange: handleChange,
            className: 'thor__input',
            value: this.state.relativeFrom,
            ref: 'relativeFrom' }),
          _react2.default.createElement(_reactSelect2.default, {
            style: { marginLeft: 10 },
            clearable: false,
            autosize: false,
            value: this.state.relativeUnits,
            onChange: handleUnit,
            options: options })
        ),
        _react2.default.createElement(
          'div',
          { className: 'kbnUITimepicker__relative-round-up' },
          _react2.default.createElement(
            'label',
            null,
            _react2.default.createElement('input', { type: 'checkbox',
              ref: 'relativeRound',
              onChange: handleCheckbox,
              checked: this.state.relativeRound }),
            'round to the ',
            _lodash2.default.trimEnd(unit.label, 's')
          )
        )
      ),
      _react2.default.createElement(
        'div',
        { className: 'kbnUITimepicker__relative-column' },
        _react2.default.createElement(
          'div',
          { className: 'kbnUITimepicker__relative-label' },
          'To: Now'
        ),
        _react2.default.createElement(
          'div',
          { className: 'kbnUITimepicker__relative-field' },
          _react2.default.createElement('input', {
            type: 'text',
            value: 'Now',
            className: 'thor__input',
            disabled: true }),
          _react2.default.createElement(
            'button',
            { onClick: handleClick, className: 'thor__button-solid-default' },
            'Go'
          )
        )
      )
    );
  },
  renderAbsolute: function renderAbsolute() {
    var _this2 = this;

    var handleChange = function handleChange(name) {
      return function (e) {
        var part = {};
        part[name] = _this2.refs[name].value;
        _this2.setState(part);
      };
    };

    var from = (0, _moment2.default)(this.state.absoluteFrom);
    var to = (0, _moment2.default)(this.state.absoluteTo);

    var fromString = this.state.absoluteFromString;
    var toString = this.state.absoluteToString;

    if ((0, _moment2.default)(fromString).isValid()) from = (0, _moment2.default)(fromString);
    if ((0, _moment2.default)(toString).isValid()) to = (0, _moment2.default)(toString);

    var validateFrom = function validateFrom(currentDate, selectedDate) {
      var current = (0, _moment2.default)(currentDate).startOf('day');
      var _from = from.clone().startOf('day');
      var _to = to.clone().startOf('day');
      return _from.isSame(current) || current.isBefore(_to) || current.isSame(_to);
    };

    var validateTo = function validateTo(currentDate, selectedDate) {
      var current = (0, _moment2.default)(currentDate).startOf('day');
      var _from = from.clone().startOf('day');
      var _to = from.clone().startOf('day');
      return _from.isSame(current) || current.isAfter(_from);
    };

    var handleDatePickerChange = function handleDatePickerChange(name) {
      return function (date) {
        var part = {};
        part[name] = date.valueOf();
        part[name + 'String'] = date.format(format);
        _this2.setState(part);
      };
    };

    var handleClick = function handleClick(e) {
      e.preventDefault();
      _this2.setState({
        mode: 'absolute',
        from: from.valueOf(),
        to: to.valueOf()
      }, function () {
        return _this2.setRange(from.valueOf(), to.valueOf());
      });
    };

    var handleNow = function handleNow(e) {
      var now = (0, _moment2.default)();
      _this2.setState({
        absoluteTo: now.valueOf(),
        absoluteToString: now.format(format)
      });
    };

    return _react2.default.createElement(
      'div',
      { className: 'kbnUITimepicker__absolute' },
      _react2.default.createElement(
        'div',
        { className: 'kbnUITimepicker__absolute-column' },
        _react2.default.createElement(
          'div',
          { className: 'kbnUITimepicker__absolute-label' },
          'From:'
        ),
        _react2.default.createElement(
          'div',
          { className: 'kbnUITimepicker__absolute-field' },
          _react2.default.createElement('input', {
            className: 'thor__input',
            ref: 'absoluteFromString',
            onChange: handleChange('absoluteFromString'),
            value: fromString })
        ),
        _react2.default.createElement(
          'div',
          { className: 'kbnUITimepicker__absolute-format' },
          format
        ),
        _react2.default.createElement(
          'div',
          { className: 'kbnUITimepicker__absolute-calendar' },
          _react2.default.createElement(_reactDatetime2.default, {
            className: 'kbnUITimepicker__calendar',
            value: from,
            isValidDate: validateFrom,
            onChange: handleDatePickerChange('absoluteFrom'),
            input: false })
        )
      ),
      _react2.default.createElement(
        'div',
        { className: 'kbnUITimepicker__absolute-column' },
        _react2.default.createElement(
          'div',
          { className: 'kbnUITimepicker__absolute-label' },
          _react2.default.createElement(
            'span',
            null,
            'To: '
          ),
          _react2.default.createElement(
            'a',
            { className: 'thor__button-solid-default sm',
              onClick: handleNow },
            'Set To Now'
          )
        ),
        _react2.default.createElement(
          'div',
          { className: 'kbnUITimepicker__absolute-field' },
          _react2.default.createElement('input', {
            className: 'thor__input',
            ref: 'absoluteToString',
            onChange: handleChange('absoluteToString'),
            value: toString })
        ),
        _react2.default.createElement(
          'div',
          { className: 'kbnUITimepicker__absolute-format' },
          format
        ),
        _react2.default.createElement(
          'div',
          { className: 'kbnUITimepicker__absolute-calendar' },
          _react2.default.createElement(_reactDatetime2.default, {
            className: 'kbnUITimepicker__calendar',
            value: to,
            isValidDate: validateTo,
            onChange: handleDatePickerChange('absoluteTo'),
            input: false })
        )
      ),
      _react2.default.createElement(
        'div',
        { className: 'kbnUITimepicker__absolute-column' },
        _react2.default.createElement(
          'button',
          {
            style: { margin: '28px 0 0 0' },
            onClick: handleClick,
            className: 'thor__button-solid-default' },
          'Go'
        )
      )
    );
  },
  setRange: function setRange(from, to) {
    this.setState({ from: from, to: to });
    if (_lodash2.default.isFunction(this.props.onChange)) {
      this.props.onChange({
        from: from,
        to: to,
        mode: this.state.mode
      });
    }
  },
  renderQuick: function renderQuick() {
    var _this3 = this;

    var pick = function pick(from, to) {
      return function (e) {
        return _this3.setRange(from, to);
      };
    };
    var renderItem = function renderItem(row, i) {
      return _react2.default.createElement(
        'a',
        {
          key: 'kbnUITimepicker-item-' + row.section + '-' + i,
          className: 'kbnUITimepicker__quick-item',
          onClick: pick(row.from, row.to) },
        row.display
      );
    };
    var bySection = function bySection(section) {
      return function (row) {
        return row.section === section;
      };
    };
    var renderColumn = function renderColumn(section) {
      return _react2.default.createElement(
        'div',
        { key: 'kbnUITimepicker-section-' + section,
          className: 'kbnUITimepicker__quick-column' },
        _quick_ranges2.default.filter(bySection(section)).map(renderItem)
      );
    };
    return _react2.default.createElement(
      'div',
      { className: 'kbnUITimepicker__quick' },
      _lodash2.default.times(4).map(renderColumn)
    );
  },
  switchTo: function switchTo(panel) {
    this.setState({ panel: panel });
  },
  render: function render() {
    var _this4 = this;

    var panel = void 0;
    var quickClassName = 'kbnUITimepicker__switcher-option';
    var relativeClassName = 'kbnUITimepicker__switcher-option';
    var absoluteClassName = 'kbnUITimepicker__switcher-option';
    switch (this.state.panel) {
      case 'absolute':
        panel = this.renderAbsolute();
        absoluteClassName += ' active';
        break;
      case 'relative':
        panel = this.renderRelative();
        relativeClassName += ' active';
        break;
      default:
        panel = this.renderQuick();
        quickClassName += ' active';
    }
    return _react2.default.createElement(
      'div',
      { className: 'kbnUITimepicker__picker' },
      _react2.default.createElement(
        'div',
        { className: 'kbnUITimepicker__switcher' },
        _react2.default.createElement(
          'a',
          { className: quickClassName,
            onClick: function onClick(e) {
              return _this4.switchTo('quick');
            } },
          'Quick'
        ),
        _react2.default.createElement(
          'a',
          { className: relativeClassName,
            onClick: function onClick(e) {
              return _this4.switchTo('relative');
            } },
          'Relative'
        ),
        _react2.default.createElement(
          'a',
          { className: absoluteClassName,
            onClick: function onClick(e) {
              return _this4.switchTo('absolute');
            } },
          'Absolute'
        )
      ),
      _react2.default.createElement(
        'div',
        { className: 'kbnUITimepicker__active_panel' },
        panel
      )
    );
  }
});
module.exports = exports['default'];