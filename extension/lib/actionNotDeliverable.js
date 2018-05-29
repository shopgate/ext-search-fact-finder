const { decorateDebug } = require('./shopgate/logDecorator')
/**
 * @param {PipelineContext} context
 * @param {Object} input
 * @returns {Promise}
 */
module.exports = async (context, input) => {
  const inputParameters = Object.assign({}, input)
  delete inputParameters.callId

  Object.keys(inputParameters).forEach(key => {
    context.log.error(decorateDebug({
      inputKey: key,
      inputValue: input[key],
      problem: 'unsupportedInputParamsCombination',
      callId: input.callId
    }), `Unsupported combination of input parameters for ${input.callId}`)
  })

  throw new Error('Provided parameter combination is not known.')
}
