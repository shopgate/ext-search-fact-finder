'use strict'
const SearchAdapter = require('./client/Search')
const SuggestAdapter = require('./client/Suggest')
const SearchBuilder = require('./client/search/Builder')
const { FactFinderAuthentication } = require('./Authentication')

class FactFinderClient {
  /**
   * @param {string} baseUri
   * @param {FactFinderAuthentication} factFinderAuthentication
   */
  constructor (baseUri, factFinderAuthentication) {
    this._baseUri = baseUri
    this._factFinderAuthentication = factFinderAuthentication
  }

  /**
   * add other options here, like page, filters
   *
   * @param {FactFinderClientSearchRequest} searchRequest
   * @returns {Promise<*>}
   */
  search (searchRequest) {
    const searchAdapter = new SearchAdapter(this._baseUri)

    return searchAdapter.execute(this._factFinderAuthentication.addAuthentication(searchRequest))
  }

  /**
   * add other options here, like page, filters
   *
   * @param {FactFinderClientSearchRequest} searchRequest
   * @returns {Promise<*>}
   */
  suggest (searchRequest) {
    const suggestAdapter = new SuggestAdapter(this._baseUri)

    return suggestAdapter.execute(this._factFinderAuthentication.addAuthentication(searchRequest))
  }

  static create (baseUri, user, password) {
    return new FactFinderClient(baseUri, new FactFinderAuthentication(user, password))
  }

  /**
   * @returns {FactFinderClientSearchBuilder}
   */
  static searchRequestBuilder () {
    return new SearchBuilder()
  }
}

module.exports = FactFinderClient
