'use strict'
const urlencode = require('urlencode')
const jsonPath = require('jsonpath')

const AbstractFactFinderClientAction = require('./Abstract')
const FactFinderInvalidResponseError = require('./errors/FactFinderInvalidResponseError')

const { filterPrepareValueForSearchParams, filterDecodeValueFromSearchParams } = require('./search/filter')
const { URLSearchParams } = require('url')

const ENDPOINT = '/Search.ff'

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
   * @returns {string}
   */
  get url () {
    return this._baseUri + ENDPOINT
  }

  /**
   * @param {FactFinderClientSearchRequest} inputSearchRequest
   * @param {Object} [httpAuth]
   * @returns {Promise<FactFinderClientSearchResponse>}
   */
  async execute (inputSearchRequest, httpAuth = {}) {
    let searchRequest = Object.assign({}, inputSearchRequest)

    const searchParams = []
    searchRequest.query = urlencode(searchRequest.query, this._encoding)

    searchParams.push('format=json')
    searchParams.push('version=7.3')

    Object.keys(searchRequest)
      .filter(parameter => parameter !== 'filters')
      .forEach(parameter => {
        searchParams.push(`${parameter}=${searchRequest[parameter]}`)
      })

    for (const filter of getFilters(searchRequest)) {
      const { filterName, filterValue } = filterPrepareValueForSearchParams(filter.name, filter.values)
      searchParams.push(`${filterName}=${filterValue}`)
    }

    const url = this.url + '?' + searchParams.join('&')
    const response = await this.request(url, httpAuth)

    if (!response.body || !response.body.searchResult || !response.body.searchResult.records) {
      throw new FactFinderInvalidResponseError({
        headers: response.headers,
        statusCode: response.statusCode,
        body: response.body
      })
    }

    const factFinderSearchResult = response.body.searchResult

    // `${product.record.shopid}-${product.id}`
    let filters = []
    if (response.body.searchResult.groups) {
      filters = prepareFiltersFromResponse(response)
    }

    return {
      uids: factFinderSearchResult.records.map((product) => {
        if (!this._uidSelector.includes('{')) {
          // uidSelector can either be a JSON path...
          // e.g. "$.id"
          return jsonPath.query(product, this._uidSelector)
        }

        // ... or a "template" which contains multiple JSON paths, each wrapped in curly braces
        // e.g. "{$.record.shopid}-{$.id}"
        return this._uidSelector.replace(/(?:{([^}]*)})/g, (match, path) => jsonPath.query(product, path))
      }),
      totalProductCount: factFinderSearchResult.resultCount,
      followSearch: getValueFromSearchParams('followSearch', factFinderSearchResult.searchParams),
      filters
    }
  }
}

/**
 * @param {Object} response
 * @return {FactFinderClientSearchFilter[]}
 */
function prepareFiltersFromResponse (response) {
  const filters = []

  response.body.searchResult.groups.forEach(group => {
    const firstElementWithFieldName = group.elements.find(element => element.associatedFieldName !== undefined)
    if (!firstElementWithFieldName) {
      return
    }

    filters.push({
      associatedFieldName: firstElementWithFieldName.associatedFieldName,
      name: group.name,
      filterStyle: group.filterStyle,
      elements: group.elements.map(element => {
        element.filterValue = filterDecodeValueFromSearchParams(element.associatedFieldName, element.searchParams)
        return element
      })
    })
  })

  return filters
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

  const urlSearchParams = new URLSearchParams(searchParams.replace(/^\//, ''))

  return urlSearchParams.get(param)
}

module.exports = {
  FactFinderClientSearch,
  filterStyle,
  filterType
}
