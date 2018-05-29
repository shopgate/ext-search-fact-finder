/**
 * @param {PipelineContext} context
 * @param {Object} input
 * @returns {Promise<Object>}
 */
module.exports = async function (context, input) {
  return {
    isSearch: false,
    isSearchFilter: false,
    isCategoryBrowsing: false,
    isProductsById: false
  }
}
