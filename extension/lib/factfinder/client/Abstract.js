const { promisify } = require('util')

const FactFinderClientError = require('./errors/FactFinderClientError')
const FactFinderServerError = require('./errors/FactFinderServerError')

class AbstractFactFinderClientAction {
  constructor (tracedRequest) {
    this._tracedRequest = tracedRequest
  }

  async request (url, body = null, httpAuth) {
    const options = {
      url: url.toString(),
      timeout: 10000,
      json: true,
      method: 'POST',
      body
    }
    if (httpAuth && httpAuth.user && httpAuth.pass) {
      options.auth = httpAuth
    }

    const response = await promisify(this._tracedRequest('Fact-Finder:suggest'))(options)

    if (response.statusCode >= 500) {
      throw new FactFinderServerError(response.statusCode)
    }
    if (response.statusCode >= 400) {
      throw new FactFinderClientError(response.statusCode)
    }

    return response
  }
}

module.exports = AbstractFactFinderClientAction
