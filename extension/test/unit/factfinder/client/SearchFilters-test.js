'use strict'
const chai = require('chai')
const sinon = require('sinon')
const proxyquire = require('proxyquire')

chai.use(require('chai-as-promised')).should()

const FactFinderServerError = require('../../../../lib/factfinder/client/errors/FactFinderServerError')
const FactFinderClientError = require('../../../../lib/factfinder/client/errors/FactFinderClientError')

let { FactFinderClientSearchFilters } = require('../../../../lib/factfinder/client/SearchFilters')

describe('FactFinderClientSearchFilters', function () {
  let needleStub, searchFilters

  const sandbox = sinon.createSandbox()

  beforeEach(() => {
    needleStub = sandbox.stub()
    FactFinderClientSearchFilters = proxyquire('../../../../lib/factfinder/client/SearchFilters', {
      'needle': needleStub
    }).FactFinderClientSearchFilters

    searchFilters = new FactFinderClientSearchFilters('https://www.shopgate.com', 'utf8')
  })

  afterEach(() => {
    sandbox.verifyAndRestore()
  })

  it('should return a list of filters', async () => {
    needleStub.withArgs('get', 'https://www.shopgate.com/Search.ff?format=json&version=7.3&query=raspberry&channel=de')
      .resolves({
        statusCode: 200,
        body: require('./mockedApiResponses/getFilteredSearch.full.success')
      })

    const expected = [
      {
        associatedFieldName: 'breadcrumbROOT/Gitarren/Westerngitarren',
        name: 'CategoryPath',
        filterStyle: 'TREE',
        elements: [
          {
            associatedFieldName: 'breadcrumbROOT/Gitarren/Westerngitarren',
            clusterLevel: 2,
            name: 'Dreadnought',
            previewImageURL: null,
            recordCount: 2,
            searchParams: '/Shopgate6.8/Search.ff?query=roxette&filterFarbe=Schwarz&filterbreadcrumbROOT=Gitarren&filtermarke=Yamaha&filterbreadcrumbROOT%2FGitarren=Westerngitarren&filterbreadcrumbROOT%2FGitarren%2FWesterngitarren=Dreadnought&channel=de&followSearch=8855&format=JSON',
            selected: false
          },
          {
            associatedFieldName: 'breadcrumbROOT/Gitarren/Westerngitarren',
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
        associatedFieldName: 'serie',
        name: 'Serie',
        filterStyle: 'DEFAULT',
        elements: [
          {
            associatedFieldName: 'serie',
            clusterLevel: 0,
            name: 'FG/FS Series',
            previewImageURL: null,
            recordCount: 2,
            searchParams: '/Shopgate6.8/Search.ff?query=roxette&filterserie=FG%2FFS+Series&filterFarbe=Schwarz&filterbreadcrumbROOT=Gitarren&filtermarke=Yamaha&filterbreadcrumbROOT%2FGitarren=Westerngitarren&channel=de&followSearch=8855&format=JSON',
            selected: false
          },
          {
            associatedFieldName: 'serie',
            clusterLevel: 0,
            name: 'FGX/FSX Series',
            previewImageURL: null,
            recordCount: 1,
            searchParams: '/Shopgate6.8/Search.ff?query=roxette&filterserie=FGX%2FFSX+Series&filterFarbe=Schwarz&filterbreadcrumbROOT=Gitarren&filtermarke=Yamaha&filterbreadcrumbROOT%2FGitarren=Westerngitarren&channel=de&followSearch=8855&format=JSON',
            selected: false
          }
        ]
      },
      {
        associatedFieldName: 'Tonabnehmer',
        name: 'Tonabnehmer',
        filterStyle: 'DEFAULT',
        elements: [
          {
            associatedFieldName: 'Tonabnehmer',
            clusterLevel: 0,
            name: 'nein',
            previewImageURL: null,
            recordCount: 2,
            searchParams: '/Shopgate6.8/Search.ff?query=roxette&filterTonabnehmer=nein&filterFarbe=Schwarz&filterbreadcrumbROOT=Gitarren&filtermarke=Yamaha&filterbreadcrumbROOT%2FGitarren=Westerngitarren&channel=de&followSearch=8855&format=JSON',
            selected: false
          },
          {
            associatedFieldName: 'Tonabnehmer',
            clusterLevel: 0,
            name: 'ja',
            previewImageURL: null,
            recordCount: 1,
            searchParams: '/Shopgate6.8/Search.ff?query=roxette&filterTonabnehmer=ja&filterFarbe=Schwarz&filterbreadcrumbROOT=Gitarren&filtermarke=Yamaha&filterbreadcrumbROOT%2FGitarren=Westerngitarren&channel=de&followSearch=8855&format=JSON',
            selected: false
          }
        ]
      },
      {
        associatedFieldName: 'Korpusform',
        name: 'Korpusform',
        filterStyle: 'DEFAULT',
        elements: [
          {
            associatedFieldName: 'Korpusform',
            clusterLevel: 0,
            name: 'Dreadnought',
            previewImageURL: null,
            recordCount: 2,
            searchParams: '/Shopgate6.8/Search.ff?query=roxette&filterFarbe=Schwarz&filterbreadcrumbROOT=Gitarren&filtermarke=Yamaha&filterbreadcrumbROOT%2FGitarren=Westerngitarren&filterKorpusform=Dreadnought&channel=de&followSearch=8855&format=JSON',
            selected: false
          },
          {
            associatedFieldName: 'Korpusform',
            clusterLevel: 0,
            name: 'Folk',
            previewImageURL: null,
            recordCount: 1,
            searchParams: '/Shopgate6.8/Search.ff?query=roxette&filterFarbe=Schwarz&filterbreadcrumbROOT=Gitarren&filtermarke=Yamaha&filterbreadcrumbROOT%2FGitarren=Westerngitarren&filterKorpusform=Folk&channel=de&followSearch=8855&format=JSON',
            selected: false
          }
        ]
      },
      {
        associatedFieldName: 'Cutaway',
        name: 'Cutaway',
        filterStyle: 'DEFAULT',
        elements: [
          {
            associatedFieldName: 'Cutaway',
            clusterLevel: 0,
            name: 'nein',
            previewImageURL: null,
            recordCount: 2,
            searchParams: '/Shopgate6.8/Search.ff?query=roxette&filterCutaway=nein&filterFarbe=Schwarz&filterbreadcrumbROOT=Gitarren&filtermarke=Yamaha&filterbreadcrumbROOT%2FGitarren=Westerngitarren&channel=de&followSearch=8855&format=JSON',
            selected: false
          },
          {
            associatedFieldName: 'Cutaway',
            clusterLevel: 0,
            name: 'ja',
            previewImageURL: null,
            recordCount: 1,
            searchParams: '/Shopgate6.8/Search.ff?query=roxette&filterCutaway=ja&filterFarbe=Schwarz&filterbreadcrumbROOT=Gitarren&filtermarke=Yamaha&filterbreadcrumbROOT%2FGitarren=Westerngitarren&channel=de&followSearch=8855&format=JSON',
            selected: false
          }
        ]
      }
    ]
    const actual = await searchFilters.execute({ query: 'raspberry', channel: 'de', filters: [] })
    chai.assert.deepEqual(actual, expected)
  })

  it('should handle 5xx errors from FACT-Finder', async () => {
    needleStub
      .resolves({
        statusCode: 500
      })
    await searchFilters.execute({ query: 'raspberry', channel: 'de', filters: [] }).should.eventually.be.rejectedWith(FactFinderServerError)
  })

  it('should handle 4xx errors from FACT-Finder', async () => {
    needleStub
      .resolves({
        statusCode: 400
      })

    await searchFilters.execute({ query: 'raspberry', filters: [] }).should.eventually.be.rejectedWith(FactFinderClientError)
  })
})
