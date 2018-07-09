'use strict'
const chai = require('chai')
const sinon = require('sinon')
const Logger = require('bunyan')

chai.use(require('chai-as-promised')).should()

const FactFinderClient = require('../../lib/factfinder/Client')
const FactFinderClientFactory = require('../../lib/shopgate/FactFinderClientFactory')
const getFilters = require('../../lib/getFilters')

describe('getFilters', async () => {
  const sandbox = sinon.createSandbox()
  const context = {
    config: {
      baseUri: 'https://www.shopgate.com/FactFinder',
      channel: 'de'
    }
  }

  let clientStub

  beforeEach(() => {
    context.log = sandbox.createStubInstance(Logger)
    clientStub = sandbox.createStubInstance(FactFinderClient)
    sandbox.stub(FactFinderClientFactory, 'createPublicClient').returns(clientStub)
  })

  afterEach(() => {
    sandbox.verifyAndRestore()
  })

  it('should return list of shopgate filters', async function () {
    const returnedFilters = [
      {
        associatedFieldName: 'breadcrumbROOT/Gitarren/Westerngitarren',
        name: 'CategoryPath',
        filterStyle: 'TREE',
        elements: [
          {
            associatedFieldName: 'breadcrumbROOT/Gitarren/Westerngitarren',
            filterValue: 'Dreadnought',
            clusterLevel: 2,
            name: 'Dreadnought',
            previewImageURL: null,
            recordCount: 2,
            searchParams: '/Shopgate6.8/Search.ff?query=roxette&filterFarbe=Schwarz&filterbreadcrumbROOT=Gitarren&filtermarke=Yamaha&filterbreadcrumbROOT%2FGitarren=Westerngitarren&filterbreadcrumbROOT%2FGitarren%2FWesterngitarren=Dreadnought&channel=de&followSearch=8855&format=JSON',
            selected: false
          },
          {
            associatedFieldName: 'breadcrumbROOT/Gitarren/Westerngitarren',
            filterValue: 'Folk-Gitarren',
            clusterLevel: 2,
            name: 'Folk-Gitarren',
            previewImageURL: null,
            recordCount: 1,
            searchParams: '/Shopgate6.8/Search.ff?query=roxette&filterFarbe=Schwarz&filterbreadcrumbROOT=Gitarren&filtermarke=Yamaha&filterbreadcrumbROOT%2FGitarren=Westerngitarren&filterbreadcrumbROOT%2FGitarren%2FWesterngitarren=Folk-Gitarren&channel=de&followSearch=8855&format=JSON',
            selected: false
          }
        ]
      },
      {
        associatedFieldName: 'Tonabnehmer',
        name: 'Tonabnehmer',
        filterStyle: 'MULTISELECT',
        elements: [
          {
            associatedFieldName: 'Tonabnehmer',
            filterValue: 'nein',
            clusterLevel: 0,
            name: 'nein',
            previewImageURL: null,
            recordCount: 2,
            searchParams: '/Shopgate6.8/Search.ff?query=roxette&filterTonabnehmer=nein&filterFarbe=Schwarz&filterbreadcrumbROOT=Gitarren&filtermarke=Yamaha&filterbreadcrumbROOT%2FGitarren=Westerngitarren&channel=de&followSearch=8855&format=JSON',
            selected: false
          },
          {
            associatedFieldName: 'Tonabnehmer',
            filterValue: 'ja',
            clusterLevel: 0,
            name: 'ja',
            previewImageURL: null,
            recordCount: 1,
            searchParams: '/Shopgate6.8/Search.ff?query=roxette&filterTonabnehmer=ja&filterFarbe=Schwarz&filterbreadcrumbROOT=Gitarren&filtermarke=Yamaha&filterbreadcrumbROOT%2FGitarren=Westerngitarren&channel=de&followSearch=8855&format=JSON',
            selected: false
          }
        ]
      }
    ]

    clientStub.search
      .resolves({ filters: returnedFilters })

    chai.assert.deepEqual(await getFilters(context, { searchPhrase: 'raspberry' }), {
      filters: [
        {
          id: 'Tonabnehmer',
          label: 'Tonabnehmer',
          source: 'fact-finder',
          type: 'multiselect',
          values: [
            {
              id: 'nein',
              label: 'nein',
              hits: 2
            },
            {
              id: 'ja',
              label: 'ja',
              hits: 1
            }
          ]
        }
      ]
    })
  })
})
