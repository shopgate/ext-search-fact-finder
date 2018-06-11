const FactFinderClient = require('./factfinder/Client')
const factFinderClientFactoryMapper = require('./shopgate/factFinderClientFactoryMapper')

// const filterTypeMap = {
//   DEFAULT: 'single_select',
//   MULTISELECT: 'multiselect'
// }

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

  try {
    const filters = await factFinderClient.searchFilters(
      FactFinderClient.searchRequestBuilder()
        .channel(context.config.channel)
        .query(input.searchPhrase)
        .build()
    )

    return { filters }
  } catch (e) {
    context.log.error(e)
    throw e
  }

  // const filters = searchResults.body.searchResult.groups.map(group => {
  //   const firstElementWithFieldName = group.elements.find(element => element.associatedFieldName !== undefined)
  //
  //   return {
  //     id: firstElementWithFieldName.associatedFieldName,
  //     label: group.name,
  //     source: 'fact-finder',
  //     type: filterTypeMap[group.filterStyle],
  //     values: group.elements.map(element => {
  //       return {
  //         id: element.name,
  //         label: element.name,
  //         hits: element.recordCount
  //       }
  //     })
  //   }
  // })
}
