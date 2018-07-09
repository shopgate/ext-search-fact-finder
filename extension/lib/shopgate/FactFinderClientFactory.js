const FactFinderClient = require('../factfinder/Client')
const { FactFinderAuthentication, AUTHENTICATION_TYPE_EXTENDED, AUTHENTICATION_TYPE_SIMPLE } = require('../factfinder/Authentication')
const { DEFAULT_ENCODING } = require('../factfinder/client/Encoding')

class FactFinderClientFactory {
  /**
   * @param {PipelineConfiguration} config
   * @returns {FactFinderClient}
   */
  static create (config) {
    const httpAuth = {}
    if (config.httpUser && config.httpPass) {
      httpAuth.user = config.httpUser
      httpAuth.pass = config.httpPass
    }
    if (config.authenticationType) {
      if (config.authenticationType === AUTHENTICATION_TYPE_SIMPLE) {
        return FactFinderClientFactory.createClientWithSimpleAuthentication(
          config.baseUri,
          httpAuth,
          config.username,
          config.password,
          config.encoding
        )
      }

      if (config.authenticationType === AUTHENTICATION_TYPE_EXTENDED) {
        return FactFinderClientFactory.createClientWithExtendedAuthentication(
          config.baseUri,
          httpAuth,
          config.username,
          config.password,
          config.authenticationPrefix,
          config.authenticationPostfix,
          config.encoding
        )
      }
    }

    return FactFinderClientFactory.createPublicClient(config.baseUri, httpAuth, config.encoding)
  }

  /**
   * @param {string} baseUri
   * @param {Object} httpAuth
   * @param {string|null} [encoding]
   * @returns {FactFinderClient}
   */
  static createPublicClient (baseUri, httpAuth, encoding) {
    return new FactFinderClient(
      baseUri,
      httpAuth,
      new FactFinderAuthentication(null, null),
      encoding || DEFAULT_ENCODING
    )
  }

  /**
   * @param {string} baseUri
   * @param {Object} httpAuth
   * @param {string} username
   * @param {string} password
   * @param {string|null} [encoding]
   * @returns {FactFinderClient}
   */
  static createClientWithSimpleAuthentication (baseUri, httpAuth, username, password, encoding) {
    return new FactFinderClient(
      baseUri,
      httpAuth,
      new FactFinderAuthentication(username, password),
      encoding || DEFAULT_ENCODING
    )
  }

  /**
   * @param {string} baseUri
   * @param {Object} httpAuth
   * @param {string} username
   * @param {string} password
   * @param {string} authenticationPrefix
   * @param {string} authenticationPostfix
   * @param {string|null} [encoding]
   * @returns {FactFinderClient}
   */
  static createClientWithExtendedAuthentication ({baseUri, httpAuth, username, password, authenticationPrefix, authenticationPostfix, encoding}) {
    return new FactFinderClient(
      baseUri,
      httpAuth,
      new FactFinderAuthentication(
        username,
        password,
        AUTHENTICATION_TYPE_EXTENDED,
        authenticationPrefix,
        authenticationPostfix),
      encoding || DEFAULT_ENCODING
    )
  }
}

module.exports = FactFinderClientFactory
