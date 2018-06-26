'use strict'
const chai = require('chai')
const sinon = require('sinon')
const proxyquire = require('proxyquire')

chai.use(require('chai-as-promised')).should()

const FactFinderServerError = require('../../../../lib/factfinder/client/errors/FactFinderServerError')
const FactFinderClientError = require('../../../../lib/factfinder/client/errors/FactFinderClientError')

let { FactFinderClientSearchFilters } = require('../../../../lib/factfinder/client/Search')

describe('FactFinderClientSearchFilters', function () {
  let requestStub, searchFilters, promisifyStub

  const sandbox = sinon.createSandbox()

  beforeEach(() => {
    requestStub = sandbox.stub()
    promisifyStub = sandbox.stub()

    FactFinderClientSearchFilters = proxyquire('../../../../lib/factfinder/client/Search', {
      '../../common/requestResolver': { tracedRequest: requestStub },
      'util': { promisify: promisifyStub }
    }).FactFinderClientSearch

    searchFilters = new FactFinderClientSearchFilters('https://www.shopgate.com', 'utf8', '$.id')
  })

  afterEach(() => {
    sandbox.verifyAndRestore()
  })

  it('should return a list of filters', async () => {
    promisifyStub.returns((options) => {
      chai.assert.deepEqual(options, {
        url: 'https://www.shopgate.com/Search.ff?format=json&version=7.3&query=raspberry&channel=de',
        json: true,
        timeout: 10000
      })

      return {
        statusCode: 200,
        body: require('./mockedApiResponses/getFilteredSearch.full.success')
      }
    })

    const expected = [
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
        associatedFieldName: 'serie',
        name: 'Serie',
        filterStyle: 'DEFAULT',
        elements: [
          {
            associatedFieldName: 'serie',
            filterValue: 'FG%2FFS+Series',
            clusterLevel: 0,
            name: 'FG/FS Series',
            previewImageURL: null,
            recordCount: 2,
            searchParams: '/Shopgate6.8/Search.ff?query=roxette&filterserie=FG%2FFS+Series&filterFarbe=Schwarz&filterbreadcrumbROOT=Gitarren&filtermarke=Yamaha&filterbreadcrumbROOT%2FGitarren=Westerngitarren&channel=de&followSearch=8855&format=JSON',
            selected: false
          },
          {
            associatedFieldName: 'serie',
            filterValue: 'FGX%2FFSX+Series',
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
      },
      {
        associatedFieldName: 'Korpusform',
        name: 'Korpusform',
        filterStyle: 'DEFAULT',
        elements: [
          {
            associatedFieldName: 'Korpusform',
            filterValue: 'Dreadnought',
            clusterLevel: 0,
            name: 'Dreadnought',
            previewImageURL: null,
            recordCount: 2,
            searchParams: '/Shopgate6.8/Search.ff?query=roxette&filterFarbe=Schwarz&filterbreadcrumbROOT=Gitarren&filtermarke=Yamaha&filterbreadcrumbROOT%2FGitarren=Westerngitarren&filterKorpusform=Dreadnought&channel=de&followSearch=8855&format=JSON',
            selected: false
          },
          {
            associatedFieldName: 'Korpusform',
            filterValue: 'Folk',
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
            filterValue: 'nein',
            clusterLevel: 0,
            name: 'nein',
            previewImageURL: null,
            recordCount: 2,
            searchParams: '/Shopgate6.8/Search.ff?query=roxette&filterCutaway=nein&filterFarbe=Schwarz&filterbreadcrumbROOT=Gitarren&filtermarke=Yamaha&filterbreadcrumbROOT%2FGitarren=Westerngitarren&channel=de&followSearch=8855&format=JSON',
            selected: false
          },
          {
            associatedFieldName: 'Cutaway',
            filterValue: 'ja',
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
    chai.assert.deepEqual(actual.filters, expected)
  })

  it('should handle 5xx errors from FACT-Finder', async () => {
    promisifyStub
      .returns(() => ({
        statusCode: 500
      }))

    await searchFilters.execute({ query: 'raspberry', channel: 'de', filters: [] }).should.eventually.be.rejectedWith(FactFinderServerError)
  })

  it('should handle 4xx errors from FACT-Finder', async () => {
    promisifyStub
      .returns(() => ({
        statusCode: 400
      }))

    await searchFilters.execute({ query: 'raspberry', filters: [] }).should.eventually.be.rejectedWith(FactFinderClientError)
  })
})
