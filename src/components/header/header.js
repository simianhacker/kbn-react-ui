import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import Timepicker from '../timepicker/picker';
import TimepickerConfig from '../timepicker/config';
import IntervalConfig from '../timepicker/interval_config';
import ConfigPanel from '../config_panel';
import EditableText from '../editable_text';
import color from 'color';

export default React.createClass({
  getInitialState() {
    return {
      showTimepicker: false,
      showInterval: false
    };
  },

  componentWillReceiveProps(props) {
    if (props.config) {
      this.setState({
        showTimepicker: false,
        showInterval: false
      });
    }
  },

  handleConfigClose() {
    this.setState({
      showTimepicker: false,
      showInterval: false
    });
    if (_.isFunction(this.props.onConfigClose)) {
      this.props.onConfigClose();
    }
  },

  handleTimepickerClick() {
    if (_.isFunction(this.props.onConfigClose)) {
      this.props.onConfigClose();
    }
    this.setState({ showInterval: false, showTimepicker: !this.state.showTimepicker });
  },

  handleTimepickerChange(timefilter) {
    if (_.isFunction(this.props.onTimepickerChange)) {
      this.props.onTimepickerChange(timefilter);
    }
    this.setState({ showTimepicker: !this.state.showTimepicker });
  },

  handleIntervalClick() {
    if (_.isFunction(this.props.onConfigClose)) {
      this.props.onConfigClose();
    }
    this.setState({ showTimepicker: false, showInterval: !this.state.showInterval });
  },


  handleTimepickerPause(paused) {
    if (_.isFunction(this.props.onPause)) {
      this.props.onPause(paused);
    }
  },

  handleIntervalChange(interval) {
    if (_.isFunction(this.props.onIntervalChange)) {
      this.props.onIntervalChange(interval);
    }
    this.setState({ showInterval: !this.state.showInterval });
  },

  render() {
    const { details, backgroundColor } = this.props;
    let config;
    if (this.props.config) {
      config = this.props.config;
    } else if (this.state.showTimepicker) {
      config = (<TimepickerConfig app={this.props.app} onChange={this.handleTimepickerChange}/>);
    } else if (this.state.showInterval) {
      config = (<IntervalConfig onChange={this.handleIntervalChange}/>);
    }
    const style = { backgroundColor };
    let className = 'kbnUIHeader';
    if (backgroundColor && color(backgroundColor).luminosity() < 0.45) {
      className = 'kbnUIHeader reversed';
    }
    return (
      <div style={style} className={className}>
        <div className="kbnUIHeader__content">
          { this.props.children }
          <Timepicker
            refresh={this.props.app.refresh}
            timefilter={this.props.app.timefilter}
            onPause={ this.handleTimepickerPause }
            onIntervalClick={ this.handleIntervalClick }
            onPickerClick={ this.handleTimepickerClick }/>
        </div>
        <ConfigPanel show={config ? true : false} onClose={this.handleConfigClose}>
          { config }
        </ConfigPanel>
      </div>
    );
  }
});
