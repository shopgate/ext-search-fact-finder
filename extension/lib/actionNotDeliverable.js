const { decorateDebug } = require('./shopgate/logDecorator')
/**
 * @param {PipelineContext} context
 * @param {Object} input
 * @returns {Promise}
 */
module.exports = async function (context, input) {
  const callId = input.callId
  const inputParameters = input
  delete inputParameters.callId

  Object.keys(inputParameters).forEach(key => {
    context.log.error(decorateDebug({
      inputKey: key,
      inputValue: input.getProperty(key),
      problem: 'unsupported',
      callId
    }), `Unsupported use case of ${callId}`)
  })
}
