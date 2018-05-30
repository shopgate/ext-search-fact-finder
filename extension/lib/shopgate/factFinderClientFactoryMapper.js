const FactFinderClient = require('../factfinder/Client')
const { AUTHENTICATION_TYPE_EXTENDED, AUTHENTICATION_TYPE_SIMPLE } = require('../factfinder/Authentication')

/**
 * @param {PipelineConfiguration} config
 * @returns {FactFinderClient}
 */
function factFinderClientFactoryMapper (config) {
  if (config.authenticationType) {
    if (config.authenticationType === AUTHENTICATION_TYPE_SIMPLE) {
      return FactFinderClient.createClientWithSimpleAuthentication(config.baseUri, config.username, config.password)
    }

    if (config.authenticationType === AUTHENTICATION_TYPE_EXTENDED) {
      return FactFinderClient.createClientWithExtendedAuthentication({
        baseUri: config.baseUri,
        username: config.username,
        password: config.password,
        authenticationPrefix: config.authenticationPrefix,
        authenticationPostfix: config.authenticationPostfix
      })
    }
  }

  return FactFinderClient.createPublicClient(config.baseUri)
}

module.exports = factFinderClientFactoryMapper
