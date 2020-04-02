'use strict'
const FactFinderClientFactory = require('./shopgate/FactFinderClientFactory')
const ExpirationStorage = require('./shopgate/storage/ExpirationStorage')
const { createHash } = require('crypto')
const { decorateError } = require('./shopgate/logDecorator')
const FactFinderInvalidResponseError = require('./factfinder/client/errors/FactFinderInvalidResponseError')

/**
 * @param {PipelineContext} context
 * @param {getSearchSuggestionsInput} input
 * @returns {Promise<getSearchSuggestionsOutput>}
 */
module.exports = async (context, input) => {
  try {
    const expirationStorage = ExpirationStorage.create(context.storage.extension)
    const suggestHash = createHash('md5').update(input.searchPhrase).digest('hex')
    const cacheKey = `suggest_${suggestHash}`

    let suggestions
    try {
      suggestions = await expirationStorage.get(cacheKey)
    } catch (err) {
      context.log.error(decorateError(err), 'Unable to fetch suggestions from cache')
    }

    if (!suggestions) {
      /** @type {FactFinderClient} */
      const factFinderClient = FactFinderClientFactory.create(context.config, context.tracedRequest)
      suggestions = await factFinderClient.suggest({query: input.searchPhrase, channel: context.config.channel})

      expirationStorage.set(cacheKey, suggestions, 3600 * 12).catch((err) => {
        context.log.error(decorateError(err), 'Unable to cache suggestions')
      })
    }

    return { suggestions }
  } catch (e) {
    context.log.error(decorateError(e), 'Failed getting suggestions')

    if (e instanceof FactFinderInvalidResponseError) {
      return {
        suggestions: [],
        contentError: {
          content: e.response
        }
      }
    }

    // ETIMEOUT code shows general error on ENGAGE
    if (e.code === 'ESOCKETTIMEDOUT' || e.code === 'ETIMEDOUT') {
      e.code = 'ETIMEOUT'
    }

    throw e
  }
}
