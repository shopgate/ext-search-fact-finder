class FactFinderClientSearchBuilder {
  constructor () {
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
  filter (name, type, values) {
    this._filters.push({
      name, values
    })
    return this
  }

  /**
   * @returns {FactFinderClientSearchRequest}
   */
  build () {
    const parameters = /** @type FactFinderClientSearchRequest */ { }
    if (this._query) {
      parameters.query = encodeURIComponent(this._query)
    }

    if (this._channel) {
      parameters.channel = this._channel
    }

    parameters.filters = this._filters

    return parameters
  }
}

module.exports = FactFinderClientSearchBuilder
