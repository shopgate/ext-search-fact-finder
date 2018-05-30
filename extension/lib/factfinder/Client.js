const SearchAdapter = require('./client/Search')
const SearchBuilder = require('./client/search/Builder')
const { DEFAULT_ENCODING } = require('./client/Encoding')
const { FactFinderAuthentication, AUTHENTICATION_TYPE_EXTENDED } = require('./Authentication')

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

  /**
   * @param {string} baseUri
   * @param {string|null} [encoding]
   * @returns {FactFinderClient}
   */
  static createPublicClient (baseUri, encoding) {
    return new FactFinderClient(baseUri, new FactFinderAuthentication(null, null), encoding || DEFAULT_ENCODING)
  }

  /**
   * @param {string} baseUri
   * @param {string} username
   * @param {string} password
   * @param {string|null} [encoding]
   * @returns {FactFinderClient}
   */
  static createClientWithSimpleAuthentication (baseUri, username, password, encoding) {
    return new FactFinderClient(
      baseUri,
      new FactFinderAuthentication(username, password),
      encoding || DEFAULT_ENCODING
    )
  }

  /**
   * @param {string} baseUri
   * @param {string} username
   * @param {string} password
   * @param {string} authenticationPrefix
   * @param {string} authenticationPostfix
   * @param {string|null} [encoding]
   * @returns {FactFinderClient}
   */
  static createClientWithExtendedAuthentication ({baseUri, username, password, authenticationPrefix, authenticationPostfix, encoding}) {
    return new FactFinderClient(
      baseUri,
      new FactFinderAuthentication(
        username,
        password,
        AUTHENTICATION_TYPE_EXTENDED,
        authenticationPrefix,
        authenticationPostfix),
      encoding || DEFAULT_ENCODING
    )
  }
}

module.exports = FactFinderClient
