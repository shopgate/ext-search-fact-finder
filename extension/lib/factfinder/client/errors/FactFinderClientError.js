'use strict'

class FactFinderClientError extends Error {
  constructor (statusCode) {
    super()
    this.message = `Client error from FACT-Finder, status: ${statusCode}`
  }
}

module.exports = FactFinderClientError
