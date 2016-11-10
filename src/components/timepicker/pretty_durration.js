import _ from 'lodash';
import moment from 'moment';
import quickRanges from './quick_ranges';
import dateMath from '@elastic/datemath';
import timeUnits from './time_units';

let lookupByRange = {};
_.each(quickRanges, function (frame) {
  lookupByRange[frame.from + ' to ' + frame.to] = frame;
});


function cantLookup(from, to) {
  let display = {};
  const format = (time, to = false) => {
    if (moment.isMoment(time)) {
      return time.format('lll');
    } else {
      if (time === 'now') {
        return 'now';
      } else {
        let tryParse = dateMath.parse(time, to);
        return moment.isMoment(tryParse) ? '~ ' + tryParse.fromNow() : time;
      }
    }
  };
  return `${format(from)} to ${format(to)}`;
};

export default (from, to) => {
  let text;
  // If both parts are date math, try to look up a reasonable string
  if (from && to && !moment.isMoment(from) && !moment.isMoment(to)) {
    let tryLookup = lookupByRange[from.toString() + ' to ' + to.toString()];
    if (tryLookup) {
      return tryLookup.display;
    } else {
      let fromParts = from.toString().split('-');
      if (to.toString() === 'now' && fromParts[0] === 'now' && fromParts[1]) {
        let rounded = fromParts[1].split('/');
        text = 'Last ' + rounded[0];
        if (rounded[1]) {
          text = text + ' rounded to the ' + timeUnits[rounded[1]];
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

