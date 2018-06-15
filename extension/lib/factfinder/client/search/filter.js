/**
 * @param {string} filterName
 * @param {string} searchParams
 * @return {string}
 */
function filterDecodeValueFromSearchParams (filterName, searchParams) {
  const filter = `filter${filterName}=(.+?)(?:$|&)`
  const matches = searchParams.match(new RegExp(filter))
  if (!matches) {
    return null
  }

  return decodeURIComponent(`${matches[1]}`)
}

/**
 * @param {string} filterName
 * @param {*} values
 * @return {{filterName: string, filterValue: string}}
 */
function filterPrepareValueForSearchParams (filterName, values) {
  return {
    filterName: `filter${filterName}`,
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
