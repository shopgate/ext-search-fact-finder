'use strict'
const urlencode = require('urlencode')
const needle = require('needle')
const jsonPath = require('jsonpath')
const {DEFAULT_ENCODING} = require('./Encoding')
const FactFinderClientError = require('./errors/FactFinderClientError')
const FactFinderServerError = require('./errors/FactFinderServerError')
const FactFinderInvalidResponseError = require('./errors/FactFinderInvalidResponseError')
const { filterPrepareValueForSearchParams } = require('./search/filter')
const { URLSearchParams } = require('url')

const ENDPOINT = '/Search.ff'

class FactFinderClientSearch {
  /**
   * @param {string} baseUri
   * @param {string} encoding
   * @param {string} uidSelector
   */
  constructor (baseUri, encoding, uidSelector) {
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
   * @returns {Promise<FactFinderClientSearchResponse>}
   */
  async execute (inputSearchRequest) {
    let searchRequest = Object.assign({}, inputSearchRequest)

    const searchParams = []
    if (this._encoding !== DEFAULT_ENCODING) {
      searchRequest.query = urlencode(searchRequest.query, this._encoding)
    }

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

    const response = await needle('get', url, {
      open_timeout: 5000,
      response_timeout: 5000,
      read_timeout: 10000
    })

    if (response.statusCode >= 500) {
      throw new FactFinderServerError(response.statusCode)
    }

    if (response.statusCode >= 400) {
      throw new FactFinderClientError(response.statusCode)
    }

    if (!response.body || !response.body.searchResult || !response.body.searchResult.records) {
      throw new FactFinderInvalidResponseError()
    }

    const factFinderSearchResult = response.body.searchResult

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
      followSearch: getValueFromSearchParams('followSearch', factFinderSearchResult.searchParams)
    }
  }
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

module.exports = FactFinderClientSearch
