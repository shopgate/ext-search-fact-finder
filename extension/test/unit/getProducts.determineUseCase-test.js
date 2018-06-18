'use strict'
const sinon = require('sinon')

const determineUseCase = require('../../lib/getProducts.determineUseCase')

describe('getProducts.determineUseCase', async () => {
  const context = /** @type PipelineContext */{}

  it('should recognize search', async function () {
    /** @type getProductsInput */
    const input = {
      searchPhrase: 'raspberry',
      limit: 30,
      offset: 0
    }

    sinon.assert.match(await determineUseCase(context, input), {
      isSearch: true,
      isSearchFilter: false,
      isCategoryBrowsing: false,
      isProductsById: false
    })
  })

  it('should recognize filtering the search', async function () {
    /** @type getProductsInput */
    const input = {
      searchPhrase: 'raspberry',
      filters: [{
        Marke: {
          source: 'fact-finder',
          type: 'multiselect',
          label: 'Marke',
          values: [{
            id: 'Raspberri+Pi',
            label: 'Raspberri Pi'
          }]
        }
      }],
      limit: 30,
      offset: 0
    }

    sinon.assert.match(await determineUseCase(context, input), {
      isSearch: false,
      isSearchFilter: true,
      isCategoryBrowsing: false,
      isProductsById: false
    })
  })

  it('should recognize category browsing', async function () {
    /** @type getProductsInput */
    const input = {
      categoryId: '123456',
      limit: 30,
      offset: 0
    }

    sinon.assert.match(await determineUseCase(context, input), {
      isSearch: false,
      isSearchFilter: false,
      isCategoryBrowsing: true,
      isProductsById: false
    })
  })

  it('should recognize fetching products by ids', async function () {
    /** @type getProductsInput */
    const input = {
      productIds: ['123456', '7890'],
      limit: 30,
      offset: 0
    }

    sinon.assert.match(await determineUseCase(context, input), {
      isSearch: false,
      isSearchFilter: false,
      isCategoryBrowsing: false,
      isProductsById: true
    })
  })
})
