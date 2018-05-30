const needle = require('needle')
const urlencode = require('urlencode')
const { DEFAULT_ENCODING } = require('./Encoding')

const ENDPOINT = '/Search.ff'
const URL = require('url').URL

class FactFinderClientSearch {
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
   * @returns {Promise<number[]>}
   */
  async execute (inputSearchRequest) {
    let searchRequest = Object.assign({}, inputSearchRequest)

    const url = new URL(this.url)
    if (this._encoding !== DEFAULT_ENCODING) {
      searchRequest.query = urlencode(searchRequest.query, this._encoding)
    }

    url.searchParams.append('format', 'json')
    url.searchParams.append('query', parameters.query)
    url.searchParams.append('channel', parameters.channel)

    return needle('get', url.toString(), { })
  }
}

module.exports = FactFinderClientSearch
