'use strict'

const FactFinderClient = require('./factfinder/Client')
const factFinderClientFactoryMapper = require('./shopgate/factFinderClientFactoryMapper')

const filterTypeMap = {
  // DEFAULT: 'single_select',
  MULTISELECT: 'multiselect'
}

/**
 * @param {PipelineContext} context
 * @param {Object} input
 * @returns {Promise<getFiltersResponse>}
 */
module.exports = async function (context, input) {
  /**
   * @type {FactFinderClient}
   */
  const factFinderClient = factFinderClientFactoryMapper(context.config)

  try {
    const factfinderFilters = await factFinderClient.searchFilters(
      FactFinderClient.searchRequestBuilder()
        .channel(context.config.channel)
        .query(input.searchPhrase)
        .build()
    )

    const filters = []
    factfinderFilters.forEach(group => {
      // skip unsupported filters
      if (undefined === filterTypeMap[group.filterStyle]) {
        return
      }

      filters.push({
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
      })
    })

    return { filters }
  } catch (e) {
    context.log.error(e)
    throw e
  }
}
