'use strict'

class FactFinderServerError extends Error {
  constructor (statusCode) {
    super()
    this.message = `Server error from FACT-Finder, status: ${statusCode}`
  }
}

module.exports = FactFinderServerError
