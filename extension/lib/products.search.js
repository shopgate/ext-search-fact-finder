const FactFinderClient = require('./factfinder/Client')
const factFinderClientFactoryMapper = require('./shopgate/factFinderClientFactoryMapper')
const { decorateError } = require('./shopgate/logDecorator')
const ShopgateProductSearchSort = require('./shopgate/product/search/sort')

/**
 * @param {PipelineContext} context
 * @param {productsSearchInput} input
 * @returns {Promise<Object>}
 */
module.exports = async function (context, input) {
  if (!input.searchPhrase) {
    return {
      searchProductCount: 0,
      searchProductIds: []
    }
  }

  /**
   * @type {FactFinderClient}
   */
  const factFinderClient = factFinderClientFactoryMapper(context.config)

  try {
    const searchRequest = FactFinderClient.searchRequestBuilder()
      .channel(context.config.channel)
      .query(input.searchPhrase)

    // sorting
    if (input.sort) {
      let shopgateSort = getFactFinderSortFieldNameAndDirection(ShopgateProductSearchSort.create(input.sort))
      if (shopgateSort === null) {
        shopgateSort = ShopgateProductSearchSort.random
      }

      const { fieldName, direction } = getFactFinderSortFieldNameAndDirection(shopgateSort)
      if (direction === null) {
        searchRequest.sortByRelevance()
      } else {
        searchRequest.sortBy(fieldName, direction)
      }
    }

    // pagination - limit and offset are optional
    if (input.limit && input.offset) {
      searchRequest.productsPerPage(input.limit)
      searchRequest.page(1 + Math.floor(input.offset / input.limit))
    }

    const searchResults = await factFinderClient.search(searchRequest.build())

    return {
      searchProductCount: searchResults.totalProductCount,
      searchProductIds: searchResults.uids
    }
  } catch (err) {
    context.log.error(decorateError(err), 'Search failed')
    throw err
  }
}

/**
 * @param {ShopgateProductSearchSort} sort
 * @return {{fieldName: string, direction: string|null}}
 */
function getFactFinderSortFieldNameAndDirection (sort) {
  return {
    fieldName: sort.fieldName,
    direction: sort.direction
  }
}
