'use strict'

const urlencode = require('urlencode')

const ENDPOINT = '/Suggest.ff'
const URL = require('url').URL

const AbstractFactFinderClientAction = require('./Abstract')
const FactFinderInvalidResponseError = require('./errors/FactFinderInvalidResponseError')

class FactFinderClientSuggest extends AbstractFactFinderClientAction {
  /**
   * @param {string} baseUri
   * @param {string} encoding
   * @param {function} tracedRequest
   */
  constructor (baseUri, encoding, tracedRequest) {
    super(tracedRequest)
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

    const response = await this.request(url, httpAuth)

    if (!response.body || !response.body.suggestions) {
      throw new FactFinderInvalidResponseError({
        headers: response.headers,
        statusCode: response.statusCode,
        body: response.body
      })
    }

    return response.body.suggestions
      .filter(suggestion => suggestion.type === 'searchTerm')
      .map(suggestion => suggestion.name)
  }
}

module.exports = FactFinderClientSuggest
