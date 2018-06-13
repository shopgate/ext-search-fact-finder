let requestImplementation = require('request')

const LOG_ERROR = 'warn'
const LOG_WARNING = 'warn'
const LOG_INFO = 'info'
const LOG_DEBUG = 'debug'
const LOG_TRACE = 'trace'

let isTracedRequest = false
const tracedRequestOptions = {
  log: false,
  logLevel: LOG_DEBUG
}

/**
 * @param {function} useRequestImplementation
 */
function useRequestImplementation (useRequestImplementation) {
  requestImplementation = useRequestImplementation
}

/**
 * @param {function} useRequestImplementation
 * @param {boolean} shouldLog
 * @param {string} logLevel
 */
function useTracedRequestImplementation (useRequestImplementation, shouldLog = false, logLevel = LOG_DEBUG) {
  requestImplementation = useRequestImplementation
  isTracedRequest = true
  tracedRequestOptions.log = shouldLog
  tracedRequestOptions.logLevel = logLevel
}

/**
 * @param {string} name
 * @returns {function}
 */
function tracedRequest (name) {
  if (!isTracedRequest) return requestImplementation

  return requestImplementation(name, tracedRequestOptions)
}

/**
 * @param {string} name
 * @param {string} logLevel
 * @returns {function}
 */
function tracedAndLoggedRequest (name, logLevel = LOG_DEBUG) {
  if (!isTracedRequest) return requestImplementation

  return requestImplementation(name, { log: true, logLevel })
}

module.exports = {
  useRequestImplementation,
  useTracedRequestImplementation,
  tracedRequest,
  tracedAndLoggedRequest,
  LOG_ERROR,
  LOG_DEBUG,
  LOG_INFO,
  LOG_WARNING,
  LOG_TRACE
}
