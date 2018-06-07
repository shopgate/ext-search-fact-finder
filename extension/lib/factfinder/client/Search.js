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
   * @param {string} [uidSelector=@id]
   * @param {string} encoding
   */
  constructor (baseUri, uidSelector, encoding) {
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
   * @param {number} [limit=20]
   * @param {number} [offset=0]
   * @returns {Promise<FactFinderClientSearchResponse>}
   */
  async execute (inputSearchRequest, limit = 20, offset = 0) {
    let searchRequest = Object.assign({}, inputSearchRequest)

    const url = new URL(this.url)
    if (this._encoding !== DEFAULT_ENCODING) {
      searchRequest.query = urlencode(searchRequest.query, this._encoding)
    }

    url.searchParams.append('format', 'json')
    url.searchParams.append('query', inputSearchRequest.query)
    url.searchParams.append('channel', inputSearchRequest.channel)
    url.searchParams.append('version', '7.3')
    url.searchParams.append('sortPREIS', 'desc')
    url.searchParams.append('productsPerPage', '36') // Default: 36
    url.searchParams.append('page', String(1 + Math.floor(offset / limit))) // Default: 1
    // url.searchParams.append('idsOnly', 'true') will not return the needed shopid property for Pollin

    let testUrl = url.toString()

    for (const parameter in searchRequest) {
      if (!searchRequest.hasOwnProperty(parameter)) {
        continue
      }
      testUrl += '&' + parameter + '=' + searchRequest[parameter]
      url.searchParams.append(parameter, searchRequest[parameter])
    }

    const response = await needle('get', testUrl, {
      open_timeout: 5000,
      response_timeout: 5000,
      read_timeout: 10000,
      follow_max: 0
    })

    if (response.statusCode >= 500) {
      throw new FactFinderServerError(response.statusCode)
    }

    if (response.statusCode >= 400) {
      throw new FactFinderClientError(response.statusCode)
    }

    if (!response.body || !response.body.searchResult) {
      throw new FactFinderInvalidResponseError()
    }

    const factFinderSearchResult = response.body.searchResult

    return {
      uids: factFinderSearchResult.records.map((product) => {
        return jsonPath.query(product, this._uidSelector)
      }),
      totalProductCount: factFinderSearchResult.resultCount
    }
  }
}

module.exports = FactFinderClientSearch
