'use strict'
const FactFinderClient = require('./factfinder/Client')
const FactFinderClientError = require('./factfinder/errors/FactFinderClientError')
const FactFinderServerError = require('./factfinder/errors/FactFinderServerError')
const FactFinderInvalidResponseError = require('./factfinder/errors/FactFinderInvalidResponseError')

/**
 * @param {PipelineContext} context
 * @param {Object} input
 * @returns {Promise<Object>}
 */
module.exports = async (context, input) => {
  try {
    const factFinderClient = FactFinderClient.create(context.config.baseUri, context.config.username, context.config.password)
    const response = await factFinderClient.suggest({query: input.searchPhrase, channel: context.config.channel})

    if (response.statusCode >= 500) {
      throw new FactFinderServerError(response.statusCode)
    }

    if (response.statusCode >= 400) {
      throw new FactFinderClientError(response.statusCode)
    }

    if (!response.body || !response.body.suggestions) {
      throw new FactFinderInvalidResponseError()
    }

    return {
      suggestions: response.body.suggestions
        .filter(suggestion => suggestion.type === 'searchTerm')
        .map(suggestion => suggestion.name)
    }
  } catch (e) {
    context.log.error(e.message)
    throw e
  }
}
