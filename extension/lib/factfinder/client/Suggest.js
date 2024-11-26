'use strict'

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
   * @param {FactFinderClientSearchRequest} inputSearchRequest
   * @param {Object} [httpAuth]
   * @returns {Promise<string[]>}
   */
  async execute (inputSearchRequest, httpAuth = {}) {
    let searchRequest = Object.assign({}, inputSearchRequest)

    const { channel } = searchRequest
    delete searchRequest.channel

    const url = new URL(`${this._baseUri}/suggest/${channel}`)
    const response = await this.request(url, searchRequest, httpAuth)

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
