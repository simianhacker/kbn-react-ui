import timeUnits from './time_units';
export default Object.keys(timeUnits).map(k => {
  return { value: k, label: timeUnits[k] };
});
