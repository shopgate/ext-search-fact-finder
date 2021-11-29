'use strict'
const chai = require('chai')
const sinon = require('sinon')
const Logger = require('bunyan')

chai.use(require('chai-as-promised')).should()

const FactFinderClient = require('../../lib/factfinder/Client')
const FactFinderInvalidResponseError = require('../../lib/factfinder/client/errors/FactFinderInvalidResponseError')
const FactFinderClientFactory = require('../../lib/shopgate/FactFinderClientFactory')
const getFilters = require('../../lib/getFilters')
const {factFinderConfig} = require('./config')
const returnedFiltersByFactFinder = require('./factfinder/client/mockedApiResponses/returnedFiltersByFactFinder.json')

describe('getFilters', async () => {
  const sandbox = sinon.createSandbox()
  const context = {
    config: {
      baseUri: factFinderConfig.endPointBaseUrl,
      channel: factFinderConfig.channel
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

  it('should return list of shopgate filters', async function () {
    clientStub.search
      .resolves({filters: returnedFiltersByFactFinder.result})

    chai.assert.deepEqual(await getFilters(context, {searchPhrase: 'Ssd Intenso'}), {
      filters: [
        {
          id: 'Speicherkapazität~~GB',
          label: 'Speicherkapazität in GB',
          source: 'fact-finder',
          type: 'multiselect',
          values: [
            {
              label: '< 150',
              hits: 6,
              id: '< 150'
            },
            {
              label: '150 - 249',
              id: '150 - 249',
              hits: 2
            },
            {
              label: '250 - 499',
              id: '250 - 499',
              hits: 6
            },
            {
              label: '500 - 749',
              id: '500 - 749',
              hits: 6
            },
            {
              label: '>= 750',
              id: '>= 750',
              hits: 4
            }
          ]
        }
      ]
    })
  })

  it('should not fail if FF content is invalid', async () => {
    clientStub.search
      .rejects(new FactFinderInvalidResponseError({response: {}}))

    const filterResult = await getFilters(context, {searchPhrase: 'unexpected search param that brakes the response'})
    chai.assert.deepEqual(filterResult.filters, [])
    chai.assert.property(filterResult, 'contentError')
    sinon.assert.called(context.log.error)
  })
})
