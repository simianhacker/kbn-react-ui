import React from 'react';
import _ from 'lodash';
const intervals = [
  [
    { value : '5s', label  : '5 seconds' },
    { value : '10s', label : '10 seconds' },
    { value : '30s', label : '30 seconds' },
    { value : '45s', label : '45 seconds' },
  ],
  [
    { value : '1m', label  : '1 minute' },
    { value : '5m', label  : '5 minute' },
    { value : '15m', label : '15 minute' },
    { value : '30m', label : '30 minute' },
  ],
  [
    { value : '1h', label  : '1 hour' },
    { value : '2h', label  : '2 hour' },
    { value : '12h', label : '12 hour' },
    { value : '1d', label  : '1 day' },
  ]
];

export default (props) => {
  const handleClick = (value) => {
    return e => {
      e.preventDefault();
      if (props.onChange) {
        props.onChange(value);
      }
    };
  };

  const columns = intervals.map((column, index) => {
    const rows = column.map(row => {
      return (
        <div key={`interval-${row.value}`} className="kbnUITimepicker__interval-item">
          <a onClick={handleClick(row.value)}>{ row.label }</a>
        </div>
      );
    });
    return (
      <div key={`interval-column-${index}`} className="kbnUITimepicker__interval-column">
        { rows }
      </div>
    );
  });

  return (
    <div className="kbnUITimepicker__interval">
      { columns }
    </div>
  );
};
