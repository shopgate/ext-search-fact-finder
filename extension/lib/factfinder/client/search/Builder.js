class FactFinderClientSearchBuilder {
  constructor () {
    this._sort = []
    this._filters = []
  }
  /**
   * @param query
   * @returns {FactFinderClientSearchBuilder}
   */
  query (query) {
    this._query = query
    return this
  }

  /**
   * @param channel
   * @returns {FactFinderClientSearchBuilder}
   */
  channel (channel) {
    this._channel = channel
    return this
  }

  /**
   * @param {string} name
   * @param {string} type
   * @param {string|number|string[]|number[]} values
   */
  addFilter (name, type, values) {
    this._filters.push({
      name, values
    })
    return this
  }

  /**
   * @param {number} pageNumber
   * @returns {FactFinderClientSearchBuilder}
   */
  page (pageNumber) {
    this._pageNumber = pageNumber
    return this
  }

  /**
   * @param {number} productsPerPage
   * @returns {FactFinderClientSearchBuilder}
   */
  productsPerPage (productsPerPage) {
    this._productsPerPage = productsPerPage
    return this
  }

  /**
   * @returns {FactFinderClientSearchBuilder}
   */
  surpressCampaigns () {
    this._useCampaigns = false
    return this
  }

  /**
   * @returns {FactFinderClientSearchBuilder}
   */
  disableCache () {
    this._disableCache = true
    return this
  }

  /**
   * This is an important parameter documented as a must use for navigating search.
   *
   * @param {number} searchId
   * @returns {FactFinderClientSearchBuilder}
   */
  followSearch (searchId) {
    this._followSearch = searchId
    return this
  }

  /**
   * @param {string} fieldName
   * @param {string} direction
   * @returns {FactFinderClientSearchBuilder}
   */
  sortBy (fieldName, direction = 'asc') {
    this._sort.push({ fieldName, direction })
    return this
  }

  /**
   * @param {string} direction
   * @returns {FactFinderClientSearchBuilder}
   */
  sortByRelevance (direction = 'desc') {
    return this.sortBy('Relevancy', direction)
  }

  /**
   * @returns {FactFinderClientSearchRequest}
   */
  build () {
    const parameters = /** @type FactFinderClientSearchRequest */ { }
    if (this._query) {
      parameters.query = this._query
    }

    if (this._channel) {
      parameters.channel = this._channel
    }

    parameters.filters = this._filters

    if ([] !== this._sort) {
      this._sort.forEach(sort => {
        parameters[`sort${sort.fieldName}`] = sort.direction
      })
    }

    parameters.page = this._pageNumber || 1
    if (this._productsPerPage) {
      parameters.productsPerPage = this._productsPerPage
    }

    if (this._useCampaigns) {
      parameters.useCampaigns = this._useCampaigns
    }

    if (this._disableCache) {
      parameters.disableCache = this._disableCache
    }

    if (this._followSearch) {
      parameters.followSearch = this._followSearch
    }

    return parameters
  }
}

module.exports = FactFinderClientSearchBuilder
