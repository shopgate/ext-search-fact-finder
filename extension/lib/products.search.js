const FactFinderClient = require('./factfinder/Client')
const factFinderClientFactoryMapper = require('./shopgate/factFinderClientFactoryMapper')
const ExpirationStorage = require('./shopgate/storage/ExpirationStorage')
const { decorateError } = require('./shopgate/logDecorator')

/**
 * @param {PipelineContext} context
 * @param {productsSearchInput} input
 * @returns {Promise<Object>}
 */
module.exports = async function (context, input) {
  /**
   * @type {FactFinderClient}
   */
  const factFinderClient = factFinderClientFactoryMapper(context.config)

  const searchResults = await factFinderClient.search(
    FactFinderClient.searchRequestBuilder()
      .channel(context.config.channel)
      .query(input.searchPhrase)
      .build()
  )

  if (searchResults.filters) {
    try {
      const cacheKey = 'searchFilters_' + encodeURIComponent(input.searchPhrase)
      await ExpirationStorage.create(context.storage.extension).set(cacheKey, searchResults.filters)
    } catch (err) {
      context.log.error(decorateError(err), 'Failed caching filters')
    }
  }

  return {
    searchProductCount: searchResults.totalProductCount,
    searchProductIds: searchResults.productIds
  }
}
