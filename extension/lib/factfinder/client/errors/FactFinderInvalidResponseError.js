'use strict'

class FactFinderInvalidResponseError extends Error {
  constructor () {
    super()
    this.code = 'EFACTFINDERINVALIDRESPONSE'
    this.message = `Empty or invalid response from FACT-Finder`
  }
}

module.exports = FactFinderInvalidResponseError
