const FactFinderClient = require('../../../factfinder/Client')

/**
 * Map of supported filters.
 * @type {{DEFAULT: string, MULTISELECT: string, , SLIDER: string}}
 */
const filterTypeMap = {
  DEFAULT: 'single_select',
  MULTISELECT: 'multiselect',
  SLIDER: 'range'
}

/**
 * @param {ShopgateProductSearchAppliedFilter} shopgateFilter
 * @return {{filterStyle: string, filterValue: string}}
 */
function getFactFinderAppliedFilterFromShopgate (shopgateFilter) {
  let filterStyle
  let value

  console.log('shopgatefilter', shopgateFilter)

  switch (shopgateFilter.type) {
    case filterTypeMap.DEFAULT: {
      filterStyle = FactFinderClient.groups.filterStyle.DEFAULT
      value = shopgateFilter.value
      break
    }

    case filterTypeMap.SLIDER: {
      filterStyle = FactFinderClient.groups.filterStyle.SLIDER
      value = [`[${shopgateFilter.minimum / 100}, ${shopgateFilter.maximum / 100}]`]
      break
    }

    default: {
      filterStyle = FactFinderClient.groups.filterStyle.MULTISELECT
      value = shopgateFilter.values
    }
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
