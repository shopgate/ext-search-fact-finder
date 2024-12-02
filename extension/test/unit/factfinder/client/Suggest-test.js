'use strict'
const chai = require('chai')
const sinon = require('sinon')
const proxyquire = require('proxyquire')

chai.use(require('chai-as-promised')).should()

const FactFinderClientError = require('../../../../lib/factfinder/client/errors/FactFinderClientError')
const FactFinderServerError = require('../../../../lib/factfinder/client/errors/FactFinderServerError')
const FactFinderInvalidResponseError = require('../../../../lib/factfinder/client/errors/FactFinderInvalidResponseError')

let FactFinderClientSuggest = require('../../../../lib/factfinder/client/Suggest')
const {factFinderConfig} = require('../../config')

describe('FactFinderClientSuggest', function () {
  let requestStub, suggest, promisifyStub

  const sandbox = sinon.createSandbox()

  beforeEach(() => {
    requestStub = sandbox.stub()
    promisifyStub = sandbox.stub()
    FactFinderClientSuggest = proxyquire('../../../../lib/factfinder/client/Suggest', {
      './Abstract': proxyquire('../../../../lib/factfinder/client/Abstract', {
        'util': { promisify: promisifyStub }
      })
    })
    suggest = new FactFinderClientSuggest(factFinderConfig.endPointBaseUrl, 'utf8', requestStub)
  })

  afterEach(() => {
    sandbox.verifyAndRestore()
  })

  it('should return a list of suggestions', async () => {
    promisifyStub.returns((options) => {
      chai.assert.deepEqual(options, {
        url: `${factFinderConfig.endPointBaseUrl}/suggest/${factFinderConfig.channel}`,
        json: true,
        timeout: 10000,
        method: 'POST',
        body: {
          query: 'Ssd'
        }
      })

      return {
        statusCode: 200,
        body: require('./mockedApiResponses/getSuggestions.success')
      }
    })

    const expected = [
      'ssd'
    ]
    const actual = await suggest.execute({ query: 'Ssd', channel: factFinderConfig.channel })

    chai.assert.deepEqual(actual, expected)
  })

  it('should return a list of multiple suggestions', async () => {
    promisifyStub.returns((options) => {
      chai.assert.deepEqual(options, {
        url: `${factFinderConfig.endPointBaseUrl}/suggest/${factFinderConfig.channel}`,
        json: true,
        timeout: 10000,
        method: 'POST',
        body: {
          query: 'kabel'
        }
      })

      return {
        statusCode: 200,
        body: require('./mockedApiResponses/getMultipleSuggestions.success.json')
      }
    })

    const expected = [
      'kabel',
      'patchkabel'
    ]
    const actual = await suggest.execute({ query: 'kabel', channel: factFinderConfig.channel })

    chai.assert.deepEqual(actual, expected)
  })

  it('should return an empty list for not existing suggestions', async () => {
    promisifyStub.returns((options) => {
      chai.assert.deepEqual(options, {
        url: `${factFinderConfig.endPointBaseUrl}/suggest/${factFinderConfig.channel}`,
        json: true,
        timeout: 10000,
        method: 'POST',
        body: {
          query: 'should not work'
        }
      })

      return {
        statusCode: 200,
        body: require('./mockedApiResponses/getNoSuggestions.success.json')
      }
    })

    const expected = []
    const actual = await suggest.execute({ query: 'should not work', channel: factFinderConfig.channel })

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
