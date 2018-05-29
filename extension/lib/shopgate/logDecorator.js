const EXTENSION = '@shopgate-search-fact-finder'

module.exports = {
  /**
   * @param {Error} err
   * @param {string} [importance='high']
   * @returns {Object}
   */
  decorateError (err, importance = 'high') {
    return {
      err: err,
      importance,
      extension: EXTENSION
    }
  },

  /**
   * @param {Object} properties
   * @returns {Object}
   */
  decorateDebug (properties) {
    const result = {
      importance: 'debug',
      extension: EXTENSION
    }

    Object.assign(result, properties)

    return result
  }
}
