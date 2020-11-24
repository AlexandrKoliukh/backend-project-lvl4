import _ from 'lodash';

export const parseFilters = (query) =>
  _.keys(query).reduce((acc, i) => {
    const queryValue = query[i];
    if (!queryValue || queryValue === 'null') return acc;
    return { ...acc, [i]: queryValue };
  }, {});
