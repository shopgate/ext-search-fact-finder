'use strict'

class FactFinderInvalidResponseError extends Error {
  /**
   * @param {Object} response
   */
  constructor (response) {
    super()
    this.response = response
    this.message = `Empty or invalid response from FACT-Finder`
  }
}

module.exports = FactFinderInvalidResponseError
