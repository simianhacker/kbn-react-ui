import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import ConfigPanel from '../config_panel';
import prettyDurration from './pretty_durration';
import prettyInterval from './pretty_interval';

export default React.createClass({
  handlePauseClick() {
    const { refresh } = this.props;
    if (_.isFunction(this.props.onPause)) {
      this.props.onPause(!refresh.paused);
    }
  },

  handlePickerClick() {
    if (_.isFunction(this.props.onPickerClick)) {
      this.props.onPickerClick();
    }
  },

  handleIntervalClick() {
    if (_.isFunction(this.props.onIntervalClick)) {
      this.props.onIntervalClick();
    }
  },

  render() {
    const { refresh, timefilter } = this.props;
    const pauseClass = refresh.paused ? 'fa fa-play' : 'fa fa-pause';
    let timefilterLabel;
    if (timefilter.mode === 'relative') {
      timefilterLabel = prettyDurration(timefilter.from, timefilter.to);
    } else {
      timefilterLabel = prettyDurration(moment(timefilter.from), moment(timefilter.to));
    }
    const intervalLabel = prettyInterval(refresh);
    return (
      <div className="kbnUITimepicker">
        <div className="kbnUITimepicker__refresh">
          <i className={pauseClass} onClick={this.handlePauseClick}></i>
          <div className="kbnUITimepicker__refresh-label" onClick={this.handleIntervalClick}>{ intervalLabel }</div>
        </div>
        <div className="kbnUITimepicker__pick">
          <i className="fa fa-clock-o"></i>
          <div className="kbnUITimepicker__pick-label" onClick={this.handlePickerClick}>{ timefilterLabel }</div>
        </div>
      </div>
    );
  }
});
