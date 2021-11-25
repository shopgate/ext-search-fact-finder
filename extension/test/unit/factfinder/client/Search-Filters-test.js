'use strict'
const chai = require('chai')
const sinon = require('sinon')
const proxyquire = require('proxyquire')

chai.use(require('chai-as-promised')).should()

const FactFinderServerError = require('../../../../lib/factfinder/client/errors/FactFinderServerError')
const FactFinderClientError = require('../../../../lib/factfinder/client/errors/FactFinderClientError')

let {FactFinderClientSearch} = require('../../../../lib/factfinder/client/Search')
const {factFinderConfig} = require('../../config')

describe('FactFinderClientSearch', function () {
  let requestStub, searchFilters, promisifyStub

  const sandbox = sinon.createSandbox()

  beforeEach(() => {
    requestStub = sandbox.stub()
    promisifyStub = sandbox.stub()

    FactFinderClientSearch = proxyquire('../../../../lib/factfinder/client/Search', {
      './Abstract': proxyquire('../../../../lib/factfinder/client/Abstract', {
        'util': {promisify: promisifyStub}
      })
    }).FactFinderClientSearch

    searchFilters = new FactFinderClientSearch(factFinderConfig.endPointBaseUrl, 'utf8', '$.id', requestStub)
  })

  afterEach(() => {
    sandbox.verifyAndRestore()
  })

  it('should return a list of filters', async () => {
    promisifyStub.returns((options) => {
      chai.assert.deepEqual(options, {
        url: `${factFinderConfig.endPointBaseUrl}/search`,
        json: true,
        timeout: 10000,
        method: 'POST',
        body: {
          params: {
            query: 'Ssd Intenso',
            filters: [],
            channel: factFinderConfig.channel
          }
        }
      })

      return {
        statusCode: 200,
        body: require('./mockedApiResponses/getFilteredSearch.full.success')
      }
    })

    const expected = [
      {
        associatedFieldName: 'category',
        name: 'Kategorie',
        filterStyle: 'TREE',
        elements: [
          {
            text: 'Interne SSD Festplatten',
            totalHits: 14,
            searchParams: {
              query: 'Ssd intenso',
              filters: [
                {
                  name: 'category',
                  values: [
                    {
                      value: [
                        'Computer & Telefon',
                        'Festplatten / Speichermedien',
                        'Interne SSD Festplatten'
                      ],
                      type: 'or',
                      exclude: false
                    }
                  ],
                  substring: false
                },
                {
                  name: 'category',
                  values: [
                    {
                      value: [
                        'Computer & Telefon'
                      ],
                      type: 'or',
                      exclude: false
                    }
                  ],
                  substring: true
                }
              ],
              sortItems: [
                {
                  order: 'desc',
                  name: 'Relevancy'
                }
              ],
              channel: 'stage_pollin_de',
              hitsPerPage: 32
            },
            selected: 'FALSE',
            clusterLevel: 2,
            filterValue: 'Computer & Telefon'
          },
          {
            text: 'Externe SSD-Festplatten',
            totalHits: 11,
            searchParams: {
              query: 'Ssd intenso',
              filters: [
                {
                  name: 'category',
                  values: [
                    {
                      value: [
                        'Computer & Telefon',
                        'Festplatten / Speichermedien',
                        'Externe SSD-Festplatten'
                      ],
                      type: 'or',
                      exclude: false
                    }
                  ],
                  substring: false
                },
                {
                  name: 'category',
                  values: [
                    {
                      value: [
                        'Computer & Telefon'
                      ],
                      type: 'or',
                      exclude: false
                    }
                  ],
                  substring: true
                }
              ],
              sortItems: [
                {
                  order: 'desc',
                  name: 'Relevancy'
                }
              ],
              channel: 'stage_pollin_de',
              hitsPerPage: 32
            },
            selected: 'FALSE',
            clusterLevel: 2,
            filterValue: 'Computer & Telefon'
          }
        ]
      },
      {
        associatedFieldName: 'Speicherkapazität~~GB',
        name: 'Speicherkapazität in GB',
        filterStyle: 'MULTISELECT',
        elements: [
          {
            text: '< 150',
            totalHits: 6,
            searchParams: {
              query: 'Ssd intenso',
              filters: [
                {
                  name: 'Speicherkapazität~~GB',
                  values: [
                    {
                      value: '[100.0, 150.0)',
                      type: 'or',
                      exclude: false
                    }
                  ],
                  substring: false
                },
                {
                  name: 'category',
                  values: [
                    {
                      value: [
                        'Computer & Telefon'
                      ],
                      type: 'or',
                      exclude: false
                    }
                  ],
                  substring: true
                }
              ],
              sortItems: [
                {
                  order: 'desc',
                  name: 'Relevancy'
                }
              ],
              channel: 'stage_pollin_de',
              hitsPerPage: 32
            },
            selected: 'FALSE',
            clusterLevel: 0,
            filterValue: '[100.0, 150.0)'
          },
          {
            text: '150 - 249',
            totalHits: 2,
            searchParams: {
              query: 'Ssd intenso',
              filters: [
                {
                  name: 'Speicherkapazität~~GB',
                  values: [
                    {
                      value: '[150.0, 250.0)',
                      type: 'or',
                      exclude: false
                    }
                  ],
                  substring: false
                },
                {
                  name: 'category',
                  values: [
                    {
                      value: [
                        'Computer & Telefon'
                      ],
                      type: 'or',
                      exclude: false
                    }
                  ],
                  substring: true
                }
              ],
              sortItems: [
                {
                  order: 'desc',
                  name: 'Relevancy'
                }
              ],
              channel: 'stage_pollin_de',
              hitsPerPage: 32
            },
            selected: 'FALSE',
            clusterLevel: 0,
            filterValue: '[150.0, 250.0)'
          },
          {
            text: '250 - 499',
            totalHits: 6,
            searchParams: {
              query: 'Ssd intenso',
              filters: [
                {
                  name: 'Speicherkapazität~~GB',
                  values: [
                    {
                      value: '[250.0, 500.0)',
                      type: 'or',
                      exclude: false
                    }
                  ],
                  substring: false
                },
                {
                  name: 'category',
                  values: [
                    {
                      value: [
                        'Computer & Telefon'
                      ],
                      type: 'or',
                      exclude: false
                    }
                  ],
                  substring: true
                }
              ],
              sortItems: [
                {
                  order: 'desc',
                  name: 'Relevancy'
                }
              ],
              channel: 'stage_pollin_de',
              hitsPerPage: 32
            },
            selected: 'FALSE',
            clusterLevel: 0,
            filterValue: '[250.0, 500.0)'
          },
          {
            text: '500 - 749',
            totalHits: 6,
            searchParams: {
              query: 'Ssd intenso',
              filters: [
                {
                  name: 'Speicherkapazität~~GB',
                  values: [
                    {
                      value: '[500.0, 750.0)',
                      type: 'or',
                      exclude: false
                    }
                  ],
                  substring: false
                },
                {
                  name: 'category',
                  values: [
                    {
                      value: [
                        'Computer & Telefon'
                      ],
                      type: 'or',
                      exclude: false
                    }
                  ],
                  substring: true
                }
              ],
              sortItems: [
                {
                  order: 'desc',
                  name: 'Relevancy'
                }
              ],
              channel: 'stage_pollin_de',
              hitsPerPage: 32
            },
            selected: 'FALSE',
            clusterLevel: 0,
            filterValue: '[500.0, 750.0)'
          },
          {
            text: '>= 750',
            totalHits: 4,
            searchParams: {
              query: 'Ssd intenso',
              filters: [
                {
                  name: 'Speicherkapazität~~GB',
                  values: [
                    {
                      value: '[750.0, 1250.0)',
                      type: 'or',
                      exclude: false
                    }
                  ],
                  substring: false
                },
                {
                  name: 'category',
                  values: [
                    {
                      value: [
                        'Computer & Telefon'
                      ],
                      type: 'or',
                      exclude: false
                    }
                  ],
                  substring: true
                }
              ],
              sortItems: [
                {
                  order: 'desc',
                  name: 'Relevancy'
                }
              ],
              channel: 'stage_pollin_de',
              hitsPerPage: 32
            },
            selected: 'FALSE',
            clusterLevel: 0,
            filterValue: '[750.0, 1250.0)'
          }
        ]
      }
    ]
    const actual = await searchFilters.execute({query: 'Ssd Intenso', channel: factFinderConfig.channel, filters: []})

    chai.assert.deepEqual(actual.filters, expected)
  })

  it('should handle 5xx errors from FACT-Finder', async () => {
    promisifyStub
      .returns(() => ({
        statusCode: 500
      }))

    await searchFilters.execute({
      query: 'raspberry',
      channel: 'de',
      filters: []
    }).should.eventually.be.rejectedWith(FactFinderServerError)
  })

  it('should handle 4xx errors from FACT-Finder', async () => {
    promisifyStub
      .returns(() => ({
        statusCode: 400
      }))

    await searchFilters.execute({
      query: 'raspberry',
      filters: []
    }).should.eventually.be.rejectedWith(FactFinderClientError)
  })
})
