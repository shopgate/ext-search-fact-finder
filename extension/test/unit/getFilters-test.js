'use strict'
const chai = require('chai')
const sinon = require('sinon')
const Logger = require('bunyan')

chai.use(require('chai-as-promised')).should()

const FactFinderClient = require('../../lib/factfinder/Client')
const FactFinderInvalidResponseError = require('../../lib/factfinder/client/errors/FactFinderInvalidResponseError')
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
    sandbox.stub(FactFinderClientFactory, 'create').returns(clientStub)
  })

  afterEach(() => {
    sandbox.verifyAndRestore()
  })

  it('should return list of shopgate filters', async function () {
    const returnedFilters = [
      {
        name: 'Kategorie',
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
            filterValue: 'Interne SSD Festplatten'
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
            filterValue: 'Externe SSD-Festplatten'
          }
        ],
        selectedElements: [
          {
            text: 'Computer & Telefon',
            totalHits: 25,
            searchParams: {
              query: 'Ssd intenso',
              filters: [
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
            selected: 'TRUE',
            clusterLevel: 0
          },
          {
            text: 'Festplatten / Speichermedien',
            totalHits: 25,
            searchParams: {
              query: 'Ssd intenso',
              filters: [
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
            selected: 'IMPLICIT',
            clusterLevel: 1
          }
        ],
        detailedLinks: 5,
        unit: '',
        type: 'CATEGORY_PATH',
        showPreviewImages: false,
        filterStyle: 'TREE',
        selectionType: 'singleHideUnselected',
        associatedFieldName: 'category'
      },
      {
        name: 'Speicherkapazität in GB',
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
            filterValue: '< 150'
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
            filterValue: '150 - 249'
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
            filterValue: '250 - 499'
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
            filterValue: '500 - 749'
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
            filterValue: '>= 750'
          }
        ],
        selectedElements: [],
        detailedLinks: 5,
        unit: 'GB',
        type: 'FLOAT',
        showPreviewImages: false,
        filterStyle: 'MULTISELECT',
        selectionType: 'multiSelectOr',
        associatedFieldName: 'Speicherkapazität~~GB'
      }
    ]

    clientStub.search
      .resolves({filters: returnedFilters})

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
