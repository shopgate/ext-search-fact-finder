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
   * @returns {StringHashMap}
   */
  build () {
    const parameters = []
    parameters.push(['format', 'json'])
    if (this._query) {
      parameters.push(['query', encodeURIComponent(this._query)])
    }

    if (this._channel) {
      parameters.push(['channel', this._channel])
    }

    return parameters
  }
}

module.exports = FactFinderClientSearchBuilder
