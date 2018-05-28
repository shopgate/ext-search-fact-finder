const ENDPOINT = '/Search.ff'
const needle = require('needle')
const URL = require('url').URL

class FactFinderClientSearch {
  /**
   * @param {string} baseUri
   */
  constructor (baseUri) {
    this._baseUri = baseUri
  }

  /**
   * @returns {string}
   */
  get url () {
    return this._baseUri + ENDPOINT
  }

  /**
   * @param {FactFinderClientSearchRequest} parameters
   * @returns {Promise<*>}
   */
  async execute (parameters) {
    const url = new URL(this.url)
    url.searchParams.append('format', 'json')
    url.searchParams.append('query', parameters.query)
    url.searchParams.append('channel', parameters.channel)

    return needle('get', url.toString(), { })
  }
}

module.exports = FactFinderClientSearch
