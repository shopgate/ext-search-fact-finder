'use strict'
const chai = require('chai')
const sinon = require('sinon')
const Logger = require('bunyan')

chai.use(require('chai-as-promised')).should()

const FactFinderClient = require('../../lib/factfinder/Client')
const FactFinderClientError = require('../../lib/factfinder/errors/FactFinderClientError')
const FactFinderServerError = require('../../lib/factfinder/errors/FactFinderServerError')
const FactFinderInvalidResponseError = require('../../lib/factfinder/errors/FactFinderInvalidResponseError')

const getSuggestions = require('../../lib/getSuggestions')

describe('getSuggestions', async () => {
  const sandbox = sinon.createSandbox()
  const context = {
    config: {
      baseUri: 'https://example.com/FactFinder',
      username: 'test',
      password: 'test',
      channel: 'pollin-de'
    }
  }
  let clientStub

  beforeEach(() => {
    context.log = sandbox.createStubInstance(Logger)
    clientStub = sandbox.createStubInstance(FactFinderClient)
    sandbox.stub(FactFinderClient, 'create').returns(clientStub)
  })

  afterEach(() => {
    sandbox.verifyAndRestore()
  })

  it('should return a list of suggestions', async () => {
    clientStub.suggest
      .withArgs({query: 'raspberry', channel: 'pollin-de'})
      .resolves({
        statusCode: 200,
        body: require('./mockedApiResponses/getSuggestions.success')
      })

    const expected = { suggestions: [
      'RASPBERRY',
      'RASPBERRY PI 3',
      'RASPBERRY PI ZERO W',
      'RASPBERRY GEHAEUSE',
      'RASPBERRY PI GEHAEUSE'
    ]}
    const actual = await getSuggestions(context, { searchPhrase: 'raspberry' })
    chai.assert.deepEqual(actual, expected)
  })

  it('should handle 4xx errors from FACT-Finder', async () => {
    clientStub.suggest
      .resolves({
        statusCode: 400
      })

    await getSuggestions(context, { searchPhrase: 'raspberry' }).should.eventually.be.rejectedWith(FactFinderClientError)
  })

  it('should handle 5xx errors from FACT-Finder', async () => {
    clientStub.suggest
      .resolves({
        statusCode: 500
      })
    await getSuggestions(context, { searchPhrase: 'raspberry' }).should.eventually.be.rejectedWith(FactFinderServerError)
  })

  it('should handle invalid responses from FACT-Finder', async () => {
    clientStub.suggest
      .resolves({
        statusCode: 200,
        body: {}
      })
    await getSuggestions(context, { searchPhrase: 'raspberry' }).should.eventually.be.rejectedWith(FactFinderInvalidResponseError)
  })
})
