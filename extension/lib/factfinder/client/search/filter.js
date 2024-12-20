/**
 * @param {string} filterName
 * @param {object} searchParams
 * @return {string}
 */
function filterDecodeValueFromSearchParams (filterName, searchParams) {
  if (!searchParams.filters) {
    return null
  }

  const filter = searchParams.filters.find(f => f.name === filterName)

  if (!filter || !filter.values) {
    return null
  }

  // eventually creates a flatten array
  return Array.prototype.concat.apply([], filter.values.map(value => value.value))[0]
}

/**
 * @param {string} filterName
 * @param {*} values
 * @return {{filterName: string, filterValues: Object[]}}
 */
function filterPrepareValueForSearchParams (filterName, values) {
  return {
    filterName: filterName,
    filterValues: getFilterValues(values)
  }
}

/**
 * @param {any} values
 * @returns {Object}
 */
function getFilterValues (values) {
  if (Array.isArray(values)) {
    return values.map(value => ({
      type: 'or',
      exclude: false,
      value
    }))
  }

  return values
}

module.exports = {
  filterDecodeValueFromSearchParams,
  filterPrepareValueForSearchParams
}
