/**
 * @param {PipelineContext} context
 * @param {getProductsInput} input
 * @returns {Promise<Object>}
 */
module.exports = async (context, input) => {
  const hasSearchPhrase = typeof input.searchPhrase !== 'undefined'
  const hasFilters = Object.keys(input.filters || {}).length > 0

  return {
    isSearch: hasSearchPhrase && !hasFilters,
    isSearchFilter: hasSearchPhrase && hasFilters,
    isCategoryBrowsing: typeof input.categoryId !== 'undefined',
    isProductsById: typeof input.productIds !== 'undefined'
  }
}
