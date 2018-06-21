'use strict'
const chai = require('chai')
const sinon = require('sinon')
const Logger = require('bunyan')

chai.use(require('chai-as-promised')).should()

const FactFinderClient = require('../../lib/factfinder/Client')
const getSuggestions = require('../../lib/getSuggestions')

describe('getSuggestions', async () => {
  const sandbox = sinon.createSandbox()
  const context = {
    config: {
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
    sandbox.stub(FactFinderClient, 'createPublicClient').returns(clientStub)
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
})
