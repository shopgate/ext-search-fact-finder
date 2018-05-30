const SearchAdapter = require('./client/Search')
const SearchBuilder = require('./client/search/Builder')
const urlencode = require('urlencode')

const DEFAULT_ENCODING = 'utf8'

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
   * @param {FactFinderClientSearchRequest} inputSearchRequest
   * @returns {Promise<*>}
   */
  search (inputSearchRequest) {
    let searchRequest = Object.assign({}, inputSearchRequest)

    if (this._encoding !== DEFAULT_ENCODING) {
      searchRequest.query = urlencode(searchRequest.query, 'iso-8859-1')
    }

    const searchAdapter = new SearchAdapter(this._baseUri)

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
