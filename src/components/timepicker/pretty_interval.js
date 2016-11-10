import timeUnits from './time_units';
export default (refresh) => {
  return `${refresh.value} ${timeUnits[refresh.unit]}`;
};
