const FactFinderClient = require('./factfinder/Client')
const factFinderClientFactoryMapper = require('./shopgate/factFinderClientFactoryMapper')
const { decorateError, decorateErrorWithParams, decorateDebug } = require('./shopgate/logDecorator')
const ShopgateProductSearchSort = require('./shopgate/product/search/sort')

const FOLLOW_SEARCH_KEY = 'followSearch'

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
      .surpressCampaigns()

    // sorting
    if (input.sort) {
      let shopgateSort = ShopgateProductSearchSort.create(input.sort)
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

    // filters
    if (input.filters) {
      Object.keys(input.filters).forEach(filter => {
        const shopgatefilter = input.filters[filter]
        // atm we support only multi select
        searchRequest.addFilter(filter, FactFinderClient.groups.filterType.MULTISELECT, shopgatefilter.values)
      })
    }

    // pagination - limit and offset are optional
    if (input.limit && input.offset) {
      searchRequest.productsPerPage(input.limit)
      searchRequest.page(1 + Math.floor(input.offset / input.limit))
    }

    const followSearch = await context.storage.device.get(FOLLOW_SEARCH_KEY)
    if (followSearch) {
      context.log.debug(decorateDebug(getCollectables(context, input, { followSearch })), 'Following search')
      searchRequest.followSearch(followSearch)
    }

    context.log.debug(searchRequest)

    const searchResults = await factFinderClient.search(searchRequest.build(), context.config.uidTemplate)

    // store the followSearch parameter
    context.storage.device.set(FOLLOW_SEARCH_KEY, searchResults.followSearch)
      .then(() => {
        context.log.debug(getCollectables(context, input, { followSearch: searchResults.followSearch }), 'debug message')
      })
      .catch(err => {
        context.log.error(decorateErrorWithParams(err, getCollectables(context, input, { followSearch: searchResults.followSearch })), 'Unable to store followSearch parameter')
      })

    return {
      searchProductCount: searchResults.totalProductCount,
      searchProductIds: searchResults.uids
    }
  } catch (err) {
    context.log.error(decorateError(err), 'Search failed')
    throw err
  }
}

function getCollectables (context, input, additional = {}) {
  const collectables = {
    searchPhrase: input.searchPhrase,
    channel: context.config.channel,
    sortDirection: input.sort
  }

  return Object.assign(collectables, additional)
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
