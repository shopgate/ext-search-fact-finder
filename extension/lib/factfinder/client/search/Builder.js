class FactFinderClientSearchBuilder {
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

    return parameters
  }
}

module.exports = FactFinderClientSearchBuilder
