'use strict'
const needle = require('needle')
const urlencode = require('urlencode')
const { DEFAULT_ENCODING } = require('./Encoding')

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
   * @returns {Promise<string[]>}
   */
  async execute (inputSearchRequest) {
    let searchRequest = Object.assign({}, inputSearchRequest)

    const url = new URL(this.url)
    if (this._encoding !== DEFAULT_ENCODING) {
      searchRequest.query = urlencode(searchRequest.query, this._encoding)
    }

    url.searchParams.append('format', 'json')
    url.searchParams.append('query', searchRequest.query)
    url.searchParams.append('channel', searchRequest.channel)

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

    if (!response.body || !response.body.suggestions) {
      throw new FactFinderInvalidResponseError()
    }

    return response.body.suggestions
      .filter(suggestion => suggestion.type === 'searchTerm')
      .map(suggestion => suggestion.name)
  }
}

module.exports = FactFinderClientSuggest
