const proxyquire = require('proxyquire')
const assert = require('assert')
const sinon = require('sinon')
let { FactFinderClientSearch } = require('../../../../lib/factfinder/client/Search')
const FactFinderClientError = require('../../../../lib/factfinder/client/errors/FactFinderClientError')
const FactFinderServerError = require('../../../../lib/factfinder/client/errors/FactFinderServerError')
const FactFinderInvalidResponseError = require('../../../../lib/factfinder/client/errors/FactFinderInvalidResponseError')

describe('FactFinderClientSearch', function () {
  /** @type FactFinderClientSearch */
  let subjectUnderTest
  let sandbox
  let requestStub
  let promisifyStub

  beforeEach(() => {
    sandbox = sinon.createSandbox()
    requestStub = sandbox.stub()
    promisifyStub = sandbox.stub()
    FactFinderClientSearch = proxyquire('../../../../lib/factfinder/client/Search', {
      './Abstract': proxyquire('../../../../lib/factfinder/client/Abstract', {
        'util': { promisify: promisifyStub }
      })
    }).FactFinderClientSearch
    subjectUnderTest = new FactFinderClientSearch('http://shopgate.fact-finder.com', 'utf8', '$.id', requestStub)
  })

  afterEach(() => {
    sandbox.restore()
  })

  it('should return uids with a simple selector', async function () {
    subjectUnderTest = new FactFinderClientSearch('http://shopgate.fact-finder.com', 'utf8', '{$.record.ARTNR}', requestStub)
    promisifyStub.returns(() => ({ body: require('./mockedApiResponses/Search-uids') }))
    assert.deepStrictEqual(await subjectUnderTest.execute({query: 'test', channel: 'test'}),
      {
        totalProductCount: 3309,
        uids: [
          '654321',
          '456789'
        ],
        followSearch: '9995',
        filters: []
      })
  })

  it('should return uids with a more complex selector', async function () {
    subjectUnderTest = new FactFinderClientSearch('http://shopgate.fact-finder.com', 'utf8', '{$.record.shopid}-{$.record.ean}', requestStub)
    promisifyStub.returns(() => ({ body: require('./mockedApiResponses/Search-uids') }))
    assert.deepStrictEqual(await subjectUnderTest.execute({query: 'test', channel: 'test', filters: []}),
      {
        totalProductCount: 3309,
        uids: [
          '43540-04712511128604',
          '69923-04013833013525'
        ],
        followSearch: '9995',
        filters: []
      })
  })

  it('should handle 4xx errors from FACT-Finder', async () => {
    promisifyStub
      .returns(() => ({
        statusCode: 400
      }))

    await subjectUnderTest.execute({ query: 'raspberry', filters: [] }).should.eventually.be.rejectedWith(FactFinderClientError)
  })

  it('should handle 5xx errors from FACT-Finder', async () => {
    promisifyStub
      .returns(() => ({
        statusCode: 500
      }))

    await subjectUnderTest.execute({ query: 'raspberry', filters: [] }).should.eventually.be.rejectedWith(FactFinderServerError)
  })

  it('should handle invalid responses from FACT-Finder', async () => {
    promisifyStub
      .returns(() => ({
        statusCode: 200,
        body: {}
      }))

    await subjectUnderTest.execute({ query: 'raspberry' }).should.eventually.be.rejectedWith(FactFinderInvalidResponseError)
  })
})
