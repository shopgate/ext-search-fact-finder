'use strict'
const jsonPath = require('jsonpath')

const AbstractFactFinderClientAction = require('./Abstract')
const FactFinderInvalidResponseError = require('./errors/FactFinderInvalidResponseError')

const { filterPrepareValueForSearchParams, filterDecodeValueFromSearchParams } = require('./search/filter')

/** @type FactFinderClientSearchFilterType */
const filterType = {
  NUMBER: 'number',
  TEXT: 'text',
  CATEGORY_PATH: 'categoryPath',
  ATTRIBUTE: 'attribute'
}

// /** @type FactFinderClientSearchFilterSelectionType */
// const filterSelectionType = {
//   MULTISELECT_OR: 'multiSelectOr',
//   MULTISELECT_AND: 'multiSelectAnd',
//   SINGLE_SHOW_UNSELECTED: 'singleShowUnselected',
//   SINGLE_HIDE_UNSELECTED: 'singleHideUnselected'
// }

const filterStyleDefinition = {
  DEFAULT: {
    type: [ filterType.ATTRIBUTE, filterType.TEXT ]
  },
  MULTISELECT: {
    type: [ filterType.TEXT, filterType.NUMBER ]
  },
  TREE: {
    type: [ filterType.CATEGORY_PATH ]
  },
  SLIDER: {
    type: []
  }
}

const filterStyle = /** @type FactFinderClientSearchFilterStyle */{}
Object.keys(filterStyleDefinition).forEach(filter => {
  filterStyle[filter] = filter
})

class FactFinderClientSearch extends AbstractFactFinderClientAction {
  /**
   * @param {string} baseUri
   * @param {string} encoding
   * @param {string} uidSelector
   * @param {function} tracedRequest
   */
  constructor (baseUri, encoding, uidSelector, tracedRequest) {
    super(tracedRequest)
    this._baseUri = baseUri
    this._uidSelector = uidSelector
    this._encoding = encoding
  }

  /**
   * @param {FactFinderClientSearchRequest} inputSearchRequest
   * @param {Object} [httpAuth]
   * @returns {Promise<FactFinderClientSearchResponse>}
   */
  async execute (inputSearchRequest, httpAuth = {}) {
    let searchRequest = Object.assign({}, inputSearchRequest)

    /**
     * @type {FactFinderClientSearchFilter[]}
     */
    const newFiltersStructure = []
    for (const filter of getFilters(searchRequest)) {
      const { filterName, filterValues } = filterPrepareValueForSearchParams(filter.name, filter.values)
      newFiltersStructure.push({
        name: filterName,
        substring: true,
        values: filterValues
      })
    }

    searchRequest.filters = newFiltersStructure

    const { channel } = searchRequest
    delete searchRequest.channel

    const response = await this.request(`${this._baseUri}/search/${channel}`, {
      params: searchRequest
    }, httpAuth)

    if (!response.body || !response.body.hits) {
      throw new FactFinderInvalidResponseError({
        headers: response.headers,
        statusCode: response.statusCode,
        body: response.body
      })
    }

    const factFinderSearchResult = response.body.hits

    // `${product.record.shopid}-${product.id}`
    let filters = []
    if (response.body.facets) {
      filters = prepareFiltersFromResponse(response)
    }

    return {
      uids: factFinderSearchResult.map((product) => {
        if (!this._uidSelector.includes('{')) {
          // uidSelector can either be a JSON path...
          // e.g. "$.id"
          return jsonPath.query(product, this._uidSelector)
        }

        // ... or a "template" which contains multiple JSON paths, each wrapped in curly braces
        // e.g. "{$.record.shopid}-{$.id}"
        return this._uidSelector.replace(/(?:{([^}]*)})/g, (match, path) => jsonPath.query(product, path))
      }),
      totalProductCount: response.body.totalHits,
      followSearch: getValueFromSearchParams('followSearch', response.body.searchParams),
      filters
    }
  }
}

/**
 * @param {Object} response
 * @return {FactFinderClientSearchFilter[]}
 */
function prepareFiltersFromResponse (response) {
  return response.body.facets.map(facet => {
    if (!facet.associatedFieldName) {
      return null
    }

    return {
      associatedFieldName: facet.associatedFieldName,
      name: facet.name,
      filterStyle: facet.filterStyle,
      elements: facet.elements.map(element => {
        const baseElement = {
          text: element.text,
          totalHits: element.totalHits,
          filterValue: filterDecodeValueFromSearchParams(facet.associatedFieldName, element.searchParams)
        }

        if (facet.filterStyle === filterStyle.SLIDER) {
          baseElement['absoluteMinValue'] = element.absoluteMinValue
          baseElement['absoluteMaxValue'] = element.absoluteMaxValue
        }

        return baseElement
      })
    }
  }).filter(Boolean)
}

/**
 * @param {FactFinderClientSearchRequest} searchRequest
 * @return {FactFinderClientSearchRequestFilter[]}
 */
function getFilters (searchRequest) {
  return searchRequest.filters || []
}

/**
 *
 * @param {string} param
 * @param {string} searchParams
 * @return {string | null}
 */
function getValueFromSearchParams (param, searchParams) {
  if (!searchParams) {
    return null
  }

  if (!searchParams[param]) {
    return null
  }

  return searchParams[param]
}

module.exports = {
  FactFinderClientSearch,
  filterStyle,
  filterType
}
