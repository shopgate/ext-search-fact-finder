'use strict'
const crypto = require('crypto')

const DEFAULT_AUTHENTICATION_PREFIX = 'FACT-FINDER'
const DEFAULT_AUTHENTICATION_POSTFIX = 'FACT-FINDER'
const AUTHENTICATION_TYPE_SIMPLE = 'simple'
const AUTHENTICATION_TYPE_EXTENDED = 'extended'

class FactFinderAuthentication {
  /**
   * @param {string|null} user
   * @param {string|null} password
   * @param {string} [authenticationType=AUTHENTICATION_TYPE_SIMPLE]
   * @param {string} [authenticationPrefix=DEFAULT_AUTHENTICATION_PREFIX]
   * @param {string} [authenticationPostfix=DEFAULT_AUTHENTICATION_POSTFIX]
   */
  constructor ({user = null, password = null, authenticationType = AUTHENTICATION_TYPE_SIMPLE, authenticationPrefix = DEFAULT_AUTHENTICATION_PREFIX, authenticationPostfix = DEFAULT_AUTHENTICATION_POSTFIX}) {
    this._user = user
    this._password = password
    if ([AUTHENTICATION_TYPE_SIMPLE, AUTHENTICATION_TYPE_EXTENDED].includes(authenticationType)) {
      this._authenticationType = authenticationType
    } else {
      this._authenticationType = AUTHENTICATION_TYPE_SIMPLE
    }
    this._authenticationPrefix = authenticationPrefix
    this._authenticationPostfix = authenticationPostfix
  }

  /**
   * @param {FactFinderClientSearchRequest} inputParameters
   * @returns {FactFinderClientSearchRequest}
   */
  addAuthentication (inputParameters) {
    const parameters = Object.assign({}, inputParameters)

    if (!this._user || !this._password) {
      return parameters
    }

    parameters.username = this._user

    let tempPassword = crypto.createHash('md5').update(this._password).digest('hex')

    if (this._authenticationType === AUTHENTICATION_TYPE_EXTENDED) {
      const timestampInMilliseconds = new Date().getTime()

      tempPassword = this._authenticationPrefix + timestampInMilliseconds + tempPassword + this._authenticationPostfix
      tempPassword = crypto.createHash('md5').update(tempPassword).digest('hex')

      parameters.timestamp = String(timestampInMilliseconds)
    }

    parameters.password = tempPassword

    return parameters
  }
}

module.exports = {
  FactFinderAuthentication,
  AUTHENTICATION_TYPE_SIMPLE,
  AUTHENTICATION_TYPE_EXTENDED
}
