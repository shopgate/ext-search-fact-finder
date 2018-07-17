'use strict'
const { tracedRequest } = require('../../common/requestResolver')
const { promisify } = require('util')

const urlencode = require('urlencode')

const ENDPOINT = '/Suggest.ff'
const URL = require('url').URL

const FactFinderClientError = require('./errors/FactFinderClientError')
const FactFinderServerError = require('./errors/FactFinderServerError')
const FactFinderInvalidResponseError = require('./errors/FactFinderInvalidResponseError')

class FactFinderClientSuggest {
  /**
   * @param {string} baseUri
   * @param {string} encoding
   */
  constructor (baseUri, encoding) {
    this._baseUri = baseUri
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
   * @returns {Promise<string[]>}
   */
  async execute (inputSearchRequest, httpAuth = {}) {
    let searchRequest = Object.assign({}, inputSearchRequest)

    const url = new URL(this.url)
    searchRequest.query = urlencode(searchRequest.query, this._encoding)

    url.searchParams.append('format', 'json')
    url.searchParams.append('query', searchRequest.query)
    url.searchParams.append('channel', searchRequest.channel)

    const options = {
      url: url.toString(),
      timeout: 10000,
      json: true
    }
    if (httpAuth && httpAuth.user && httpAuth.pass) {
      options.auth = httpAuth
    }
    const response = await promisify(tracedRequest('Fact-Finder:suggest'))(options)

    if (response.statusCode >= 500) {
      throw new FactFinderServerError(response.statusCode)
    }

    if (response.statusCode >= 400) {
      throw new FactFinderClientError(response.statusCode)
    }

    if (!response.body || !response.body.suggestions) {
      throw new FactFinderInvalidResponseError()
    }

    return response.body.suggestions
      .filter(suggestion => suggestion.type === 'searchTerm')
      .map(suggestion => suggestion.name)
  }
}

module.exports = FactFinderClientSuggest
