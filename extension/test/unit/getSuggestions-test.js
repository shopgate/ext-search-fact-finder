'use strict'
const chai = require('chai')
const sinon = require('sinon')
const Logger = require('bunyan')

chai.use(require('chai-as-promised')).should()

const FactFinderClient = require('../../lib/factfinder/Client')
const FactFinderInvalidResponseError = require('../../lib/factfinder/client/errors/FactFinderInvalidResponseError')
const FactFinderClientFactory = require('../../lib/shopgate/FactFinderClientFactory')
const getSuggestions = require('../../lib/getSuggestions')

describe('getSuggestions', async () => {
  const sandbox = sinon.createSandbox()
  const context = {
    config: {
      // TODO:
      baseUri: 'https://www.shopgate.com/FactFinder',
      channel: 'de'
    },
    storage: {
      extension: {
        get: sandbox.stub(),
        set: sandbox.stub()
      }
    }
  }

  let clientStub

  beforeEach(() => {
    context.log = sandbox.createStubInstance(Logger)
    clientStub = sandbox.createStubInstance(FactFinderClient)
    sandbox.stub(FactFinderClientFactory, 'create').returns(clientStub)
  })

  afterEach(() => {
    sandbox.verifyAndRestore()
  })

  it('should return list of suggestions from search', async function () {
    const returnedSuggestions = [
      'RASPBERRY',
      'RASPBERRY PI 3',
      'RASPBERRY PI ZERO W',
      'RASPBERRY GEHAEUSE',
      'RASPBERRY PI GEHAEUSE'
    ]

    clientStub.suggest
      .withArgs({ query: 'raspberry', channel: 'de' })
      .resolves(returnedSuggestions)

    chai.assert.deepEqual(await getSuggestions(context, { searchPhrase: 'raspberry' }), { suggestions: returnedSuggestions })
  })

  it('should log errors', async function () {
    clientStub.suggest
      .rejects(new Error())

    await getSuggestions(context, { searchPhrase: 'raspberry' }).should.be.rejected
    sinon.assert.called(context.log.error)
  })

  it('should log if reading from cache fails', async () => {
    context.storage.extension.get.rejects(new Error())

    await getSuggestions(context, { searchPhrase: 'raspberry' })
    sinon.assert.called(context.log.error)
  })

  it('should log if writing to cache fails', async () => {
    context.storage.extension.set.rejects(new Error())

    await getSuggestions(context, { searchPhrase: 'raspberry' })
    sinon.assert.called(context.log.error)
  })

  it('should not fail if FF content is invalid', async () => {
    context.storage.extension.get.resolves(null)

    clientStub.suggest
      .withArgs({ query: 'unexpected search param that brakes the response', channel: 'de' })
      .rejects(new FactFinderInvalidResponseError({response: {}}))

    const suggestionsResult = await getSuggestions(context, { searchPhrase: 'unexpected search param that brakes the response' })
    chai.assert.deepEqual(suggestionsResult.suggestions, [])
    chai.assert.property(suggestionsResult, 'contentError')
    sinon.assert.called(context.log.error)
  })
})
