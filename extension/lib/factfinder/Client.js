const SearchAdapter = require('./client/Search')
const SearchBuilder = require('./client/search/Builder')

class FactFinderClient {
  /**
   * @param {string} baseUri
   * @param {FactFinderAuthentication} authentication
   */
  constructor (baseUri, authentication) {
    this._baseUri = baseUri
    this._authentication = authentication
  }

  /**
   * add other options here, like page, filters
   *
   * @param {FactFinderClientSearchRequest} searchRequest
   * @returns {Promise<*>}
   */
  search (searchRequest) {
    const searchAdapter = new SearchAdapter(this._baseUri)

    return searchAdapter.execute(this._authentication.addAuthentication(searchRequest))
  }

  /**
   * @returns {FactFinderClientSearchBuilder}
   */
  static searchRequestBuilder () {
    return new SearchBuilder()
  }
}

module.exports = FactFinderClient
