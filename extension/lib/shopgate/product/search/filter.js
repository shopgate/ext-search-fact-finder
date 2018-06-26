const FactFinderClient = require('../../../factfinder/Client')

/**
 * Map of supported filters.
 * @type {{DEFAULT: string, MULTISELECT: string}}
 */
const filterTypeMap = {
  DEFAULT: 'single_select',
  MULTISELECT: 'multiselect'
}

/**
 * @param {ShopgateProductSearchAppliedFilter} shopgateFilter
 * @return {{filterStyle: string, filterValue: string}}
 */
function getFactFinderAppliedFilterFromShopgate (shopgateFilter) {
  let filterStyle = FactFinderClient.groups.filterStyle.MULTISELECT
  let value = shopgateFilter.values
  if (shopgateFilter.type === filterTypeMap.DEFAULT) {
    filterStyle = FactFinderClient.groups.filterStyle.DEFAULT
    value = shopgateFilter.value
  }

  return {
    filterStyle,
    filterValue: value
  }
}

module.exports = {
  filterTypeMap,
  getFactFinderAppliedFilterFromShopgate
}
