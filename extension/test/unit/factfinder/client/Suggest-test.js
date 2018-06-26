'use strict'
const chai = require('chai')
const sinon = require('sinon')
const proxyquire = require('proxyquire')

chai.use(require('chai-as-promised')).should()

const FactFinderClientError = require('../../../../lib/factfinder/client/errors/FactFinderClientError')
const FactFinderServerError = require('../../../../lib/factfinder/client/errors/FactFinderServerError')
const FactFinderInvalidResponseError = require('../../../../lib/factfinder/client/errors/FactFinderInvalidResponseError')

let FactFinderClientSuggest = require('../../../../lib/factfinder/client/Suggest')

describe('FactFinderClientSuggest', function () {
  let requestStub, suggest, promisifyStub

  const sandbox = sinon.createSandbox()

  beforeEach(() => {
    requestStub = sandbox.stub()
    promisifyStub = sandbox.stub()
    FactFinderClientSuggest = proxyquire('../../../../lib/factfinder/client/Suggest', {
      '../../common/requestResolver': { tracedRequest: requestStub },
      'util': { promisify: promisifyStub }
    })
    suggest = new FactFinderClientSuggest('https://www.shopgate.com', 'utf8')
  })

  afterEach(() => {
    sandbox.verifyAndRestore()
  })

  it('should return a list of suggestions', async () => {
    promisifyStub.returns((options) => {
      chai.assert.deepEqual(options, {
        url: 'https://www.shopgate.com/Suggest.ff?format=json&query=raspberry&channel=de',
        json: true,
        timeout: 10000
      })

      return {
        statusCode: 200,
        body: require('./mockedApiResponses/getSuggestions.success')
      }
    })

    const expected = [
      'RASPBERRY',
      'RASPBERRY PI 3',
      'RASPBERRY PI ZERO W',
      'RASPBERRY GEHAEUSE',
      'RASPBERRY PI GEHAEUSE'
    ]
    const actual = await suggest.execute({ query: 'raspberry', channel: 'de' })
    chai.assert.deepEqual(actual, expected)
  })

  it('should handle 4xx errors from FACT-Finder', async () => {
    promisifyStub
      .returns(() => ({
        statusCode: 400
      }))

    await suggest.execute({ query: 'raspberry' }).should.eventually.be.rejectedWith(FactFinderClientError)
  })

  it('should handle 5xx errors from FACT-Finder', async () => {
    promisifyStub
      .returns(() => ({
        statusCode: 500
      }))

    await suggest.execute({ query: 'raspberry' }).should.eventually.be.rejectedWith(FactFinderServerError)
  })

  it('should handle invalid responses from FACT-Finder', async () => {
    promisifyStub
      .returns(() => ({
        statusCode: 200,
        body: {}
      }))

    await suggest.execute({ query: 'raspberry' }).should.eventually.be.rejectedWith(FactFinderInvalidResponseError)
  })
})
