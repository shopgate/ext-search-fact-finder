const ENDPOINT = '/Search.ff'
const needle = require('needle')

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
   * @param {StringHashMap} parameters
   * @returns {Promise<*>}
   */
  async execute (parameters) {
    const url = `${this.url}?${parameters.map(parameter => parameter.join('=')).join('&')}`

    return await needle('get', url, { })
  }
}

module.exports = FactFinderClientSearch
