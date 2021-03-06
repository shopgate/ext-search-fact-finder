const { createHash } = require('crypto')
const FactFinderClient = require('./factfinder/Client')
const FactFinderClientFactory = require('./shopgate/FactFinderClientFactory')
const { decorateError, decorateErrorWithParams, decorateDebug } = require('./shopgate/logDecorator')
const ShopgateProductSearchSort = require('./shopgate/product/search/sort')
const { getFactFinderAppliedFilterFromShopgate } = require('./shopgate/product/search/filter')
const ShopgateErrorBadRequest = require('./shopgate/error/BadRequest')
const FactFinderInvalidResponseError = require('./factfinder/client/errors/FactFinderInvalidResponseError')

const FOLLOW_SEARCH_KEY = 'followSearch'

/**
 * @param {PipelineContext} context
 * @param {productsSearchInput} input
 * @returns {Promise<Object>}
 */
module.exports = async (context, input) => {
  if (!input.searchPhrase) {
    return {
      searchProductCount: null,
      productIds: input.productIds || undefined
    }
  }

  /**
   * @type {FactFinderClient}
   */
  const factFinderClient = FactFinderClientFactory.create(context.config, context.tracedRequest)

  try {
    const searchHash = createHash('md5').update(input.searchPhrase).digest('hex')
    const followSearchCacheKey = `${FOLLOW_SEARCH_KEY}_${searchHash}`

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

      const direction = getSortDirection(shopgateSort)
      if (direction === null) {
        searchRequest.sortByRelevance()
      } else {
        searchRequest.sortBy(context.config.sortPriceName, direction)
      }
    }

    // filters
    if (input.filters) {
      Object.keys(input.filters).forEach(filter => {
        const { filterStyle, filterValue } = getFactFinderAppliedFilterFromShopgate(input.filters[filter])
        searchRequest.addFilter(filter, filterStyle, filterValue)
      })
    }

    // pagination - limit and offset are optional
    if (input.limit) {
      searchRequest.productsPerPage(input.limit)
    }

    let page = 1
    if (input.limit && input.offset) {
      page = 1 + Math.ceil(input.offset / input.limit)
      searchRequest.page(page)
    }

    // Append follow search only for next pages (do not append to initial call)
    if (page > 1) {
      const followSearch = await context.storage.device.get(followSearchCacheKey)
      if (followSearch) {
        context.log.debug(decorateDebug(getCollectables(context, input, { followSearch })), 'Following search')
        searchRequest.followSearch(followSearch)
      }
    }

    const searchResults = await factFinderClient.search(searchRequest.build(), context.config.uidTemplate)

    // store the followSearch parameter
    context.storage.device.set(followSearchCacheKey, searchResults.followSearch)
      .catch(err => {
        context.log.warn(decorateErrorWithParams(err, getCollectables(context, input, { followSearch: searchResults.followSearch })), 'Unable to store followSearch parameter')
      })

    context.log.debug(`got ${searchResults.totalProductCount} results from fact-finder for '${input.searchPhrase}'`)

    return {
      searchProductCount: searchResults.totalProductCount,
      productIds: searchResults.uids
    }
  } catch (err) {
    context.log.error(decorateError(err), 'Search failed')
    if (err instanceof FactFinderInvalidResponseError) {
      return {
        searchProductCount: 0,
        productIds: [],
        contentError: {
          content: err.response
        }
      }
    }

    if (err.code === 400) {
      throw new ShopgateErrorBadRequest('We were unable to deliver results for a given search. Please check your input and try again.')
    }

    // ETIMEOUT code shows general error on ENGAGE
    if (err.code === 'ESOCKETTIMEDOUT' || err.code === 'ETIMEDOUT') {
      err.code = 'ETIMEOUT'
    }

    throw err
  }
}

/**
 * @param {PipelineContext} context
 * @param {productsSearchInput} input
 * @param {Object} additional
 * @return {*}
 */
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
 * @return {string|null}
 */
function getSortDirection (sort) {
  return sort.direction ? sort.direction.toLowerCase() : null
}
