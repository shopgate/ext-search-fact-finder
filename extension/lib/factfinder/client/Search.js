'use strict'
const urlencode = require('urlencode')
const needle = require('needle')
const jsonPath = require('jsonpath')
const {DEFAULT_ENCODING} = require('./Encoding')
const FactFinderClientError = require('./errors/FactFinderClientError')
const FactFinderServerError = require('./errors/FactFinderServerError')
const FactFinderInvalidResponseError = require('./errors/FactFinderInvalidResponseError')

const ENDPOINT = '/Search.ff'
const URL = require('url').URL

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

    const url = new URL(this.url)
    if (this._encoding !== DEFAULT_ENCODING) {
      searchRequest.query = urlencode(searchRequest.query, this._encoding)
    }

    url.searchParams.append('format', 'json')
    url.searchParams.append('version', '7.3')

    for (const parameter in searchRequest) {
      url.searchParams.append(parameter, searchRequest[parameter])
    }

    const response = await needle('get', url.toString(), {
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
        return this._uidSelector.replace(/(?:\{([^\}]*)\})/g, (match, path) => jsonPath.query(product, path))
      }),
      totalProductCount: factFinderSearchResult.resultCount
    }
  }
}

module.exports = FactFinderClientSearch
