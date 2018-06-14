'use strict'

const FactFinderClient = require('./factfinder/Client')
const factFinderClientFactoryMapper = require('./shopgate/factFinderClientFactoryMapper')

const filterTypeMap = {
  // DEFAULT: 'single_select',
  MULTISELECT: 'multiselect'
}

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
    factFinderClient = factFinderClientFactoryMapper(context.config)
  }

  try {
    const searchRequest = FactFinderClient.searchRequestBuilder()
      .channel(context.config.channel)
      .query(input.searchPhrase)

    if (input.filters) {
      Object.keys(input.filters).forEach(filter => {
        const shopgatefilter = input.filters[filter]
        // atm we support only multi select
        searchRequest.addFilter(shopgatefilter.label, FactFinderClient.groups.filterType.MULTISELECT, shopgatefilter.values)
      })
    }
    const factFinderFilters = await factFinderClient.searchFilters(searchRequest.build())

    const filters = factFinderFilters.filter(group => undefined !== filterTypeMap[group.filterStyle])
      .map(group => (
        {
          id: group.associatedFieldName,
          label: group.name,
          source: 'fact-finder',
          type: filterTypeMap[group.filterStyle],
          values: group.elements.map(element => {
            return {
              id: element.name,
              label: element.name,
              hits: element.recordCount
            }
          })
        }
      ))

    return { filters }
  } catch (e) {
    context.log.error(e)
    throw e
  }
}
