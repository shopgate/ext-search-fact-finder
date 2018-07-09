'use strict'
const { FactFinderClientSearch, filterType, filterStyle } = require('./client/Search')
const SuggestAdapter = require('./client/Suggest')
const SearchBuilder = require('./client/search/Builder')
const { DEFAULT_ENCODING } = require('./client/Encoding')

class FactFinderClient {
  /**
   * @param {string} baseUri
   * @param {Object} httpAuth
   * @param {FactFinderAuthentication} factFinderAuthentication
   * @param {string} [encoding=DEFAULT_ENCODING]
   */
  constructor (baseUri, httpAuth, factFinderAuthentication, encoding = DEFAULT_ENCODING) {
    this._baseUri = baseUri
    this._httpAuth = httpAuth
    this._factFinderAuthentication = factFinderAuthentication
    this._encoding = encoding.toLowerCase()
  }

  /**
   * add other options here, like page, filters
   *
   * @param {FactFinderClientSearchRequest} searchRequest
   * @param {string} uidSelector
   * @returns {Promise<FactFinderClientSearchResponse>}
   */
  search (searchRequest, uidSelector) {
    const searchAdapter = new FactFinderClientSearch(this._baseUri, this._encoding, uidSelector)

    return searchAdapter.execute(
      this._factFinderAuthentication.addAuthentication(searchRequest),
      this._httpAuth
    )
  }

  /**
   * @returns {{filterType: FactFinderClientSearchFilterType, filterStyle: FactFinderClientSearchFilterStyle}}
   */
  static get groups () {
    return {
      filterType,
      filterStyle
    }
  }

  /**
   * add other options here, like page, filters
   *
   * @param {FactFinderClientSearchRequest} searchRequest
   * @returns {Promise<string[]>}
   */
  suggest (searchRequest) {
    const suggestAdapter = new SuggestAdapter(this._baseUri, this._encoding)

    return suggestAdapter.execute(
      this._factFinderAuthentication.addAuthentication(searchRequest),
      this._httpAuth
    )
  }

  /**
   * @returns {FactFinderClientSearchBuilder}
   */
  static searchRequestBuilder () {
    return new SearchBuilder()
  }
}

module.exports = FactFinderClient
