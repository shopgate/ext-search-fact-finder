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
 * @return {{filterName: string, filterValue: string}}
 */
function filterPrepareValueForSearchParams (filterName, values) {
  return {
    filterName: encodeURIComponent(filterName),
    filterValue: getFilterValue(values)
  }
}

/**
 * @param {any} value
 * @returns {string}
 */
function getFilterValue (value) {
  if (Array.isArray(value)) {
    return value.join('~~~')
  }

  return value
}

module.exports = {
  filterDecodeValueFromSearchParams,
  filterPrepareValueForSearchParams
}
