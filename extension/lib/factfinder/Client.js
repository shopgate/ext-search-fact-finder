const SearchAdapter = require('./client/Search')
const SearchBuilder = require('./client/search/Builder')

class FactFinderClient {
  /**
   * @param {string} baseUri
   * @param {string} user
   * @param {string} password
   */
  constructor (baseUri, user, password) {
    this._baseUri = baseUri
    this._user = user
    this._password = password
  }

  /**
   * add other options here, like page, filters
   *
   * @param {StringHashMap} searchRequest
   * @returns {Promise<*>}
   */
  search (searchRequest) {
    const searchAdapter = new SearchAdapter(this._baseUri)
    return searchAdapter.execute(searchRequest)
  }

  /**
   * @returns {FactFinderClientSearchBuilder}
   */
  static searchRequestBuilder () {
    return new SearchBuilder()
  }
}

module.exports = FactFinderClient
