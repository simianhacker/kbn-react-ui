'use strict';

exports.__esModule = true;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _quick_ranges = require('./quick_ranges');

var _quick_ranges2 = _interopRequireDefault(_quick_ranges);

var _datemath = require('@elastic/datemath');

var _datemath2 = _interopRequireDefault(_datemath);

var _time_units = require('./time_units');

var _time_units2 = _interopRequireDefault(_time_units);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var lookupByRange = {};
_lodash2.default.each(_quick_ranges2.default, function (frame) {
  lookupByRange[frame.from + ' to ' + frame.to] = frame;
});

function cantLookup(from, to) {
  var display = {};
  var format = function format(time) {
    var to = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    if (_moment2.default.isMoment(time)) {
      return time.format('lll');
    } else {
      if (time === 'now') {
        return 'now';
      } else {
        var tryParse = _datemath2.default.parse(time, to);
        return _moment2.default.isMoment(tryParse) ? '~ ' + tryParse.fromNow() : time;
      }
    }
  };
  return format(from) + ' to ' + format(to);
};

exports.default = function (from, to) {
  var text = void 0;
  // If both parts are date math, try to look up a reasonable string
  if (from && to && !_moment2.default.isMoment(from) && !_moment2.default.isMoment(to)) {
    var tryLookup = lookupByRange[from.toString() + ' to ' + to.toString()];
    if (tryLookup) {
      return tryLookup.display;
    } else {
      var fromParts = from.toString().split('-');
      if (to.toString() === 'now' && fromParts[0] === 'now' && fromParts[1]) {
        var rounded = fromParts[1].split('/');
        text = 'Last ' + rounded[0];
        if (rounded[1]) {
          text = text + ' rounded to the ' + _time_units2.default[rounded[1]];
        }
        return text;
      } else {
        return cantLookup(from, to);
      }
    }
    // If at least one part is a moment, try to make pretty strings by parsing date math
  } else {
    return cantLookup(from, to);
  }
};

module.exports = exports['default'];