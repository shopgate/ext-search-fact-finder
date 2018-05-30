const SearchAdapter = require('./client/Search')
const SearchBuilder = require('./client/search/Builder')
const { DEFAULT_ENCODING } = require('./client/Encoding')

class FactFinderClient {
  /**
   * @param {string} baseUri
   * @param {FactFinderAuthentication} factFinderAuthentication
   * @param {string} [encoding=DEFAULT_ENCODING]
   */
  constructor (baseUri, factFinderAuthentication, encoding = DEFAULT_ENCODING) {
    this._baseUri = baseUri
    this._factFinderAuthentication = factFinderAuthentication
    this._encoding = encoding.toLowerCase()
  }

  /**
   * add other options here, like page, filters
   *
   * @param {FactFinderClientSearchRequest} searchRequest
   * @returns {Promise<*>}
   */
  search (searchRequest) {
    const searchAdapter = new SearchAdapter(this._baseUri, this._encoding)

    return searchAdapter.execute(this._factFinderAuthentication.addAuthentication(searchRequest))
  }

  /**
   * @returns {FactFinderClientSearchBuilder}
   */
  static searchRequestBuilder () {
    return new SearchBuilder()
  }
}

module.exports = FactFinderClient
