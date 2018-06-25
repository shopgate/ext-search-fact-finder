'use strict'
const chai = require('chai')
const sinon = require('sinon')
const Logger = require('bunyan')

chai.use(require('chai-as-promised')).should()

const FactFinderClient = require('../../lib/factfinder/Client')
const search = require('../../lib/getProducts.search')

describe('getProducts.search', async () => {
  const sandbox = sinon.createSandbox()
  const context = {
    config: {
      baseUri: 'https://www.shopgate.com/FactFinder',
      channel: 'de',
      uidTemplate: '{$.id}',
      sortPriceName: 'PREIS'
    },
    storage: {
      device: {}
    }
  }

  /** @var {FactFinderClient} */
  let clientStub
  let storageGetStub, storageSetStub

  beforeEach(() => {
    context.log = sandbox.createStubInstance(Logger)
    clientStub = sandbox.createStubInstance(FactFinderClient)
    sandbox.stub(FactFinderClient, 'createPublicClient').returns(clientStub)
    storageGetStub = sandbox.stub()
    storageSetStub = sandbox.stub()
    context.storage.device.get = storageGetStub
    context.storage.device.set = storageSetStub
  })

  afterEach(() => {
    sandbox.verifyAndRestore()
  })

  it('should return product identifiers for a given search', async function () {
    const returnedProductIds = {
      uids: [ '888888-88888', '77758-6985' ],
      totalProductCount: 2,
      followSearch: 111
    }

    clientStub.search
      .resolves(returnedProductIds)

    storageSetStub.returns(Promise.resolve())

    chai.assert.deepEqual(await search(context, { searchPhrase: 'raspberry' }), {
      searchProductIds: [ '888888-88888', '77758-6985' ],
      searchProductCount: 2
    })

    sinon.assert.calledWith(clientStub.search, sinon.match(
      FactFinderClient.searchRequestBuilder()
        .channel('de')
        .query('raspberry')
        .build(),
      context.config.uidTemplate
    ))
  })

  it('should map the sorting', async function () {
    const returnedProductIds = {
      uids: [ '888888-88888', '77758-6985' ],
      totalProductCount: 2,
      followSearch: 111
    }

    clientStub.search
      .resolves(returnedProductIds)

    storageSetStub.returns(Promise.resolve())

    await search(context, { searchPhrase: 'raspberry', sort: 'relevance' })

    sinon.assert.calledWith(clientStub.search, sinon.match(
      FactFinderClient.searchRequestBuilder()
        .channel('de')
        .sortByRelevance()
        .query('raspberry')
        .build(),
      context.config.uidTemplate
    ))

    clientStub.search
      .resolves(returnedProductIds)

    await search(context, { searchPhrase: 'raspberry', sort: 'priceAsc' })

    sinon.assert.calledWith(clientStub.search, sinon.match(
      FactFinderClient.searchRequestBuilder()
        .channel('de')
        .sortBy('PREIS', 'asc')
        .query('raspberry')
        .build(),
      context.config.uidTemplate
    ))
  })

  it('should apply filters', async function () {
    const returnedProductIds = {
      uids: [ '888888-88888', '77758-6985' ],
      totalProductCount: 2,
      followSearch: 111
    }

    clientStub.search
      .resolves(returnedProductIds)

    storageSetStub.returns(Promise.resolve())

    await search(context, {
      searchPhrase: 'raspberry',
      filters: {
        Marke: {
          source: 'fact-finder',
          type: 'multiselect',
          values: [ 'Raspberry+Pi' ]
        }
      }
    })

    sinon.assert.calledWith(clientStub.search, sinon.match(
      FactFinderClient.searchRequestBuilder()
        .channel('de')
        .addFilter('Marke', 'MULTISELECT', [ 'Raspberry+Pi' ])
        .query('raspberry')
        .build(),
      context.config.uidTemplate
    ))
  })

  it('should paginate search results when limit/offset are provided', async function () {
    const returnedProductIds = {
      uids: [ '888888-88888', '77758-6985' ],
      totalProductCount: 2,
      followSearch: 111
    }

    clientStub.search
      .resolves(returnedProductIds)

    storageSetStub.returns(Promise.resolve())

    await search(context, {
      searchPhrase: 'raspberry',
      limit: 30,
      offset: 30
    })

    sinon.assert.calledWith(clientStub.search, sinon.match(
      FactFinderClient.searchRequestBuilder()
        .channel('de')
        .productsPerPage(30)
        .page(2)
        .query('raspberry')
        .build(),
      context.config.uidTemplate
    ))
  })

  it('should save the followSearch to the storage', async function () {
    const returnedProductIds = {
      uids: [ '888888-88888', '77758-6985' ],
      totalProductCount: 2,
      followSearch: 111
    }

    clientStub.search
      .resolves(returnedProductIds)

    storageSetStub.returns(Promise.resolve())

    await search(context, {
      searchPhrase: 'raspberry',
      limit: 30,
      offset: 30
    })

    sinon.assert.called(storageSetStub)
  })

  it('should return no product identifiers when there is no search phrase given', async function () {
    chai.assert.deepEqual(await search(context, { }), {
      searchProductIds: [],
      searchProductCount: 0
    })
  })

  it('should log errors', async function () {
    clientStub.search
      .rejects(new Error())

    await search(context, { searchPhrase: 'raspberry' }).should.be.rejected
    sinon.assert.called(context.log.error)
  })
})
