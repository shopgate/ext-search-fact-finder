const EXTENSION = '@shopgate-search-fact-finder'

module.exports = {
  /**
   * @param {Error} err
   * @returns {Object}
   */
  decorateError (err) {
    return {
      err: err,
      extension: EXTENSION
    }
  },

  /**
   * @param {Error} err
   * @param {Object} params
   */
  decorateErrorWithParams (err, params) {
    const decoratedError = this.decorateError(err)
    return Object.assign(decoratedError, params)
  },

  /**
   * @param {Object} properties
   * @returns {Object}
   */
  decorateDebug (properties) {
    const result = {
      extension: EXTENSION
    }

    Object.assign(result, properties)

    return result
  }
}
