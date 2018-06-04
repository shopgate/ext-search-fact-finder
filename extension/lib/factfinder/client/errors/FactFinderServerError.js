'use strict'

class FactFinderServerError extends Error {
  constructor (statusCode) {
    super()
    this.code = 'EFACTFINDERSERVER'
    this.message = `Server error from FACT-Finder, status: ${statusCode}`
  }
}

module.exports = FactFinderServerError
