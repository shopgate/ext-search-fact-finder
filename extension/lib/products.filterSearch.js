const FactFinderClient = require('./factfinder/Client')
const factFinderClientFactoryMapper = require('./shopgate/factFinderClientFactoryMapper')
const ExpirationStorage = require('./shopgate/storage/ExpirationStorage')
const { decorateError } = require('./shopgate/logDecorator')

/**
 * @param {PipelineContext} context
 * @param {Object} input
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

  return {}
}
