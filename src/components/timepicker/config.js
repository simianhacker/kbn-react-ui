import React from 'react';
import _ from 'lodash';
import dateMath from '@elastic/datemath';
import moment from 'moment';
import quickRanges from './quick_ranges';
import units from './units';
import Select from 'react-select';
import DateTime from 'react-datetime';
const format = 'YYYY-MM-DD HH:mm:ss.SSS';

export default React.createClass({

  getInitialState() {
    const { app } = this.props;
    const { timefilter } = app;
    let relativeFrom = 15;
    let relativeUnits = 'm';
    let relativeRound = false;
    const matches = _.isString(timefilter.from) &&
      timefilter.from.match(/^now\-(\d+)([msMhdyw]|ms)(\/)?([msMhdyw]|ms)?/);
    if (timefilter.mode === 'relative' && timefilter.to === 'now' && matches) {
      relativeFrom = Number(matches[1]);
      relativeUnits = matches[2];
      relativeRound = matches[3] != null;
    }
    return {
      panel: 'quick',
      mode: 'relative',
      relativeFrom,
      relativeUnits,
      relativeRound,
      absoluteFrom: app.timerange.min.valueOf(),
      absoluteTo: app.timerange.max.valueOf(),
      absoluteToString: app.timerange.max.format(format),
      absoluteFromString: app.timerange.min.format(format)
    };
  },

  renderRelative() {
    let fromString = `now-${this.state.relativeFrom}${this.state.relativeUnits}`;
    if (this.state.relativeRound) fromString += `/${this.state.relativeUnits}`;

    let fromLabel = dateMath.parse(fromString, 'now')
      .add(1, 'ms') // ugh... off by 1ms
      .format('MMMM Do, YYYY HH:mm:ss.SSS');

    const handleChange = () => {
      const relativeFrom = this.refs.relativeFrom.value;
      this.setState({ relativeFrom });
    };

    const handleCheckbox = () =>  {
      const relativeRound = this.refs.relativeRound.checked;
      this.setState({ relativeRound });
    };

    const handleUnit = (value) => {
      const relativeUnits = value.value;
      this.setState({ relativeUnits });
    };

    const handleClick = (e) => {
      e.preventDefault();
      this.setRange(fromString, 'now');
    };

    const options = units.map(u => {
      const label = _.capitalize(u.label);
      return {
        value: u.value,
        label: `${label} ago`
      };
    });

    const unit = units.find(u => u.value === this.state.relativeUnits);

    return (
      <div className="timepicker__relative">
        <div className="timepicker__relative-column">
          <div className="timepicker__relative-label">From: { fromLabel }</div>
          <div className="timepicker__relative-field">
            <input
              type="number"
              onChange={handleChange}
              className="thor__input"
              value={this.state.relativeFrom}
              ref="relativeFrom"/>
            <Select
              style={{ marginLeft: 10 }}
              clearable={false}
              autosize={false}
              value={this.state.relativeUnits}
              onChange={handleUnit}
              options={options}/>
          </div>
          <div className="timepicker__relative-round-up">
            <label>
              <input type="checkbox"
                ref="relativeRound"
                onChange={handleCheckbox}
                checked={this.state.relativeRound}/>
              round to the { _.trimEnd(unit.label, 's') }
            </label>
          </div>
        </div>
        <div className="timepicker__relative-column">
          <div className="timepicker__relative-label">To: Now</div>
          <div className="timepicker__relative-field">
            <input
              type="text"
              value="Now"
              className="thor__input"
              disabled={true}/>
            <button onClick={handleClick} className="thor__button-solid-default">Go</button>
          </div>
        </div>
      </div>
    );
  },

  renderAbsolute() {
    const handleChange = (name) => {
      return (e) => {
        const part = {};
        part[name] = this.refs[name].value;
        this.setState(part);
      };
    };


    let from = moment(this.state.absoluteFrom);
    let to = moment(this.state.absoluteTo);

    const fromString = this.state.absoluteFromString;
    const toString = this.state.absoluteToString;

    if (moment(fromString).isValid()) from = moment(fromString);
    if (moment(toString).isValid()) to = moment(toString);

    const validateFrom = (currentDate, selectedDate) => {
      const current = moment(currentDate).startOf('day');
      const _from = from.clone().startOf('day');
      const _to = to.clone().startOf('day');
      return _from.isSame(current) || (current.isBefore(_to) || current.isSame(_to));
    };

    const validateTo = (currentDate, selectedDate) => {
      const current = moment(currentDate).startOf('day');
      const _from = from.clone().startOf('day');
      const _to = from.clone().startOf('day');
      return _from.isSame(current) || (current.isAfter(_from));
    };

    const handleDatePickerChange = (name) => {
      return (date) => {
        const part = {};
        part[name] = date.valueOf();
        part[`${name}String`] = date.format(format);
        this.setState(part);
      };
    };

    const handleClick = (e) => {
      e.preventDefault();
      this.setState({
        mode: 'absolute',
        from: from.valueOf(),
        to: to.valueOf()
      }, () => this.setRange(from.valueOf(), to.valueOf()));
    };

    const handleNow = (e) => {
      const now = moment();
      this.setState({
        absoluteTo: now.valueOf(),
        absoluteToString: now.format(format)
      });
    };

    return (
      <div className="timepicker__absolute">
        <div className="timepicker__absolute-column">
          <div className="timepicker__absolute-label">From:</div>
          <div className="timepicker__absolute-field">
            <input
              className="thor__input"
              ref="absoluteFromString"
              onChange={handleChange('absoluteFromString')}
              value={fromString}/>
          </div>
          <div className="timepicker__absolute-format">{ format }</div>
          <div className="timepicker__absolute-calendar">
            <DateTime
              className="timepicker__calendar"
              value={from}
              isValidDate={validateFrom}
              onChange={handleDatePickerChange('absoluteFrom')}
              input={false}/>
          </div>
        </div>
        <div className="timepicker__absolute-column">
          <div className="timepicker__absolute-label">
            <span>To: </span>
            <a className="thor__button-solid-default sm"
              onClick={handleNow}>Set To Now</a>
          </div>
          <div className="timepicker__absolute-field">
            <input
              className="thor__input"
              ref="absoluteToString"
              onChange={handleChange('absoluteToString')}
              value={toString}/>
          </div>
          <div className="timepicker__absolute-format">{ format }</div>
          <div className="timepicker__absolute-calendar">
            <DateTime
              className="timepicker__calendar"
              value={to}
              isValidDate={validateTo}
              onChange={handleDatePickerChange('absoluteTo')}
              input={false}/>
          </div>
        </div>
        <div className="timepicker__absolute-column">
          <button
            style={{ margin: '28px 0 0 0' }}
            onClick={handleClick}
            className="thor__button-solid-default">Go</button>
        </div>
      </div>
    );
  },

  setRange(from, to) {
    this.setState({ from, to });
    if (_.isFunction(this.props.onChange)) {
      this.props.onChange({
        from,
        to,
        mode: this.state.mode
      });
    }
  },

  renderQuick() {
    const pick = (from, to) => e => this.setRange(from, to);
    const renderItem = (row, i) => {
      return (
        <a
          key={`timepicker-item-${row.section}-${i}`}
          className="timepicker__quick-item"
          onClick={pick(row.from, row.to)}>{ row.display }</a>
      );
    };
    const bySection = section => row => row.section === section;
    const renderColumn = section => {
      return (
        <div key={`timepicker-section-${section}`}
          className="timepicker__quick-column">
          { quickRanges.filter(bySection(section)).map(renderItem) }
        </div>
      );
    };
    return (
      <div className="timepicker__quick">
        { _.times(4).map(renderColumn) }
      </div>
    );
  },

  switchTo(panel) {
    this.setState({ panel });
  },

  render() {
    let panel;
    let quickClassName = 'timepicker__switcher-option';
    let relativeClassName = 'timepicker__switcher-option';
    let absoluteClassName = 'timepicker__switcher-option';
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
    return (
      <div className="timepicker__picker">
        <div className="timepicker__switcher">
          <a className={quickClassName}
            onClick={ e => this.switchTo('quick') }>Quick</a>
          <a className={relativeClassName}
            onClick={ e => this.switchTo('relative') }>Relative</a>
          <a className={absoluteClassName}
            onClick={ e => this.switchTo('absolute') }>Absolute</a>
       </div>
        <div className="timepicker__active_panel">{ panel }</div>
      </div>
    );
  }
});

