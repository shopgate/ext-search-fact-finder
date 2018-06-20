'use strict'
const factFinderClientMapper = require('./shopgate/factFinderClientFactoryMapper')
const { decorateError } = require('./shopgate/logDecorator')

/**
 * @param {PipelineContext} context
 * @param {getSearchSuggestionsInput} input
 * @returns {Promise<getSearchSuggestionsOutput>}
 */
module.exports = async (context, input) => {
  try {
    /** @type {FactFinderClient} */
    const factFinderClient = factFinderClientMapper(context.config)
    const suggestions = await factFinderClient.suggest({query: input.searchPhrase, channel: context.config.channel})

    return { suggestions }
  } catch (e) {
    context.log.error(decorateError(e), 'Failed getting the suggestions')
    throw e
  }
}
