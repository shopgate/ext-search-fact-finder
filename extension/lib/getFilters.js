'use strict'

const FactFinderClient = require('./factfinder/Client')
const FactFinderClientFactory = require('./shopgate/FactFinderClientFactory')
const { decorateError } = require('./shopgate/logDecorator')
const { filterTypeMap, getFactFinderAppliedFilterFromShopgate } = require('./shopgate/product/search/filter')
const FactFinderInvalidResponseError = require('./factfinder/client/errors/FactFinderInvalidResponseError')

/**
 * @param {PipelineContext} context
 * @param {getFiltersRequest} input
 * @returns {Promise<getFiltersResponse>}
 */
module.exports = async function (context, input) {
  if (!input.searchPhrase) {
    return { filters: [] }
  }

  /**
   * @type {FactFinderClient}
   */
  const factFinderClient = FactFinderClientFactory.create(context.config, context.tracedRequest)

  try {
    const searchRequest = FactFinderClient.searchRequestBuilder()
      .channel(context.config.channel)
      .query(input.searchPhrase)

    if (input.filters) {
      Object.keys(input.filters).forEach(filter => {
        const { filterStyle, filterValue } = getFactFinderAppliedFilterFromShopgate(input.filters[filter])
        searchRequest.addFilter(filter, filterStyle, filterValue)
      })
    }
    const factFinderResponse = await factFinderClient.search(searchRequest.build(), context.config.uidTemplate)

    const filters = factFinderResponse.filters.filter(filter => undefined !== filterTypeMap[filter.filterStyle])
      .map(filter => {
        const baseFilterObject = {
          id: filter.associatedFieldName,
          label: filter.name,
          type: filterTypeMap[filter.filterStyle]
        }

        const isSlider = baseFilterObject.type === filterTypeMap.SLIDER
        const isPriceField = context.config.priceSliderId === baseFilterObject.id

        if (isSlider && !isPriceField) {
          return null
        }

        if (isSlider && isPriceField) {
          let min = Infinity
          let max = -Infinity

          filter.elements.forEach(element => {
            const {text} = element
            const matches = /(\d*[,.]\d*) - (\d*[,.]\d*)/.exec(text)
            min = Math.min(min, parseFloat(matches[1]))
            max = Math.max(max, parseFloat(matches[2]))
          })

          return {
            ...baseFilterObject,
            minimum: parseInt(min * 100),
            maximum: parseInt(max * 100)
          }
        }

        return {
          ...baseFilterObject,
          source: 'fact-finder',
          values: filter.elements.map(element => {
            return {
              id: element.filterValue,
              label: element.text,
              hits: element.totalHits
            }
          })
        }
      }).filter(Boolean)

    return { filters }
  } catch (e) {
    context.log.error(decorateError(e), 'Failed getting the filters')
    if (e instanceof FactFinderInvalidResponseError) {
      return {
        filters: [],
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
