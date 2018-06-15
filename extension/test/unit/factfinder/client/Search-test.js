const proxyquire = require('proxyquire')
const assert = require('assert')
const {describe, it, beforeEach, afterEach} = require('mocha')
const sinon = require('sinon')
let Search = require('../../../../lib/factfinder/client/Search')
const FactFinderClientError = require('../../../../lib/factfinder/client/errors/FactFinderClientError')
const FactFinderServerError = require('../../../../lib/factfinder/client/errors/FactFinderServerError')
const FactFinderInvalidResponseError = require('../../../../lib/factfinder/client/errors/FactFinderInvalidResponseError')

describe('FactFinderClientSearch', function () {
  /** @type FactFinderClientSearch */
  let subjectUnderTest
  let sandbox
  let needleStub

  beforeEach(() => {
    sandbox = sinon.createSandbox()
    needleStub = sandbox.stub()
    Search = proxyquire('../../../../lib/factfinder/client/Search', {
      'needle': needleStub
    })
    subjectUnderTest = new Search('http://shopgate.fact-finder.com', 'utf8', '$.id')
  })

  afterEach(() => {
    sandbox.restore()
  })

  it('should return uids with a simple selector', async function () {
    subjectUnderTest = new Search('http://shopgate.fact-finder.com', 'utf8', '{$.record.ARTNR}')
    needleStub.returns({body: require('./mockedApiResponses/Search-uids')})
    assert.deepStrictEqual(await subjectUnderTest.execute({query: 'test', channel: 'test'}),
      {
        'totalProductCount': 3309,
        'uids': [
          '654321',
          '456789'
        ]
      })
  })

  it('should return uids with a more complex selector', async function () {
    subjectUnderTest = new Search('http://shopgate.fact-finder.com', 'utf8', '{$.record.shopid}-{$.record.ean}')
    needleStub.returns({body: require('./mockedApiResponses/Search-uids')})
    assert.deepStrictEqual(await subjectUnderTest.execute({query: 'test', channel: 'test'}),
      {
        'totalProductCount': 3309,
        'uids': [
          '43540-04712511128604',
          '69923-04013833013525'
        ]
      })
  })

  it('should handle 4xx errors from FACT-Finder', async () => {
    needleStub
      .resolves({
        statusCode: 400
      })

    await subjectUnderTest.execute({ query: 'raspberry' }).should.eventually.be.rejectedWith(FactFinderClientError)
  })

  it('should handle 5xx errors from FACT-Finder', async () => {
    needleStub
      .resolves({
        statusCode: 500
      })
    await subjectUnderTest.execute({ query: 'raspberry' }).should.eventually.be.rejectedWith(FactFinderServerError)
  })

  it('should handle invalid responses from FACT-Finder', async () => {
    needleStub
      .resolves({
        statusCode: 200,
        body: {}
      })
    await subjectUnderTest.execute({ query: 'raspberry' }).should.eventually.be.rejectedWith(FactFinderInvalidResponseError)
  })
})
