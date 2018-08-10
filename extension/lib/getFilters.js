'use strict'

const FactFinderClient = require('./factfinder/Client')
const FactFinderClientFactory = require('./shopgate/FactFinderClientFactory')
const { decorateError } = require('./shopgate/logDecorator')
const { filterTypeMap, getFactFinderAppliedFilterFromShopgate } = require('./shopgate/product/search/filter')

/**
 * @type {FactFinderClient}
 */
let factFinderClient

/**
 * @param {PipelineContext} context
 * @param {getFiltersRequest} input
 * @returns {Promise<getFiltersResponse>}
 */
module.exports = async function (context, input) {
  if (!input.searchPhrase) {
    return { filters: [] }
  }

  if (!factFinderClient) {
    factFinderClient = FactFinderClientFactory.create(context.config, context.tracedRequest)
  }

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

    const filters = factFinderResponse.filters.filter(group => undefined !== filterTypeMap[group.filterStyle])
      .map(group => (
        {
          id: group.associatedFieldName,
          label: group.name,
          source: 'fact-finder',
          type: filterTypeMap[group.filterStyle],
          values: group.elements.map(element => {
            return {
              id: element.filterValue,
              label: element.name,
              hits: element.recordCount
            }
          })
        }
      ))

    return { filters }
  } catch (e) {
    context.log.error(decorateError(e), 'Failed getting the filters')
    throw e
  }
}
