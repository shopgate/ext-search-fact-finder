const FactFinderClient = require('../factfinder/Client')
const { FactFinderAuthentication } = require('../factfinder/Authentication')
const { DEFAULT_ENCODING } = require('../factfinder/client/Encoding')

class FactFinderClientFactory {
  /**
   * @param {PipelineConfiguration} config
   * @param {function} tracedRequest
   * @returns {FactFinderClient}
   */
  static create (config, tracedRequest) {
    const httpAuth = {}
    if (config.httpUser && config.httpPass) {
      httpAuth.user = config.httpUser
      httpAuth.pass = config.httpPass
    }

    return new FactFinderClient({
      baseUri: config.baseUri,
      httpAuth,
      factFinderAuthentication: new FactFinderAuthentication(config),
      encoding: config.encoding || DEFAULT_ENCODING,
      tracedRequest
    })
  }
}

module.exports = FactFinderClientFactory
