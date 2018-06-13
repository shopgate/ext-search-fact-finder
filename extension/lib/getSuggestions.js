'use strict'
const factFinderClientMapper = require('./shopgate/factFinderClientFactoryMapper')
const { useTracedRequestImplementation } = require('./common/requestResolver')
/**
 * @param {PipelineContext} context
 * @param {getSearchSuggestionsInput} input
 * @returns {Promise<getSearchSuggestionsOutput>}
 */
module.exports = async (context, input) => {
  useTracedRequestImplementation(context.tracedRequest)

  try {
    /** @type {FactFinderClient} */
    const factFinderClient = factFinderClientMapper(context.config)
    const suggestions = await factFinderClient.suggest({query: input.searchPhrase, channel: context.config.channel})

    return { suggestions }
  } catch (e) {
    context.log.error(e.message)
    throw e
  }
}
