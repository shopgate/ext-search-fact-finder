const ShopgateProductSearchSort = require('../../../../../lib/shopgate/product/search/sort')
const sinon = require('sinon')

describe('ShopgateProductSearchSort', function () {
  it('should create its own instance from string', function () {
    sinon.assert.pass(ShopgateProductSearchSort.create('priceAsc') instanceof ShopgateProductSearchSort)
    sinon.assert.pass(ShopgateProductSearchSort.create('priceDesc') instanceof ShopgateProductSearchSort)
    sinon.assert.pass(ShopgateProductSearchSort.create('relevance') instanceof ShopgateProductSearchSort)
    sinon.assert.pass(ShopgateProductSearchSort.random instanceof ShopgateProductSearchSort)
  })

  it('should not create itself for unsupported sort string', function () {
    sinon.assert.pass(!(ShopgateProductSearchSort.create('invalid sort string') instanceof ShopgateProductSearchSort))
    sinon.assert.match(ShopgateProductSearchSort.create('invalid sort string'), null)
  })

  it('should provide field name and direction', function () {
    let shopgateSort = ShopgateProductSearchSort.create('priceAsc')
    sinon.assert.match(shopgateSort.fieldName, 'price')
    sinon.assert.match(shopgateSort.direction, 'Asc')

    shopgateSort = ShopgateProductSearchSort.create('priceDesc')
    sinon.assert.match(shopgateSort.fieldName, 'price')
    sinon.assert.match(shopgateSort.direction, 'Desc')

    shopgateSort = ShopgateProductSearchSort.create('relevance')
    sinon.assert.match(shopgateSort.fieldName, 'relevance')
    sinon.assert.match(shopgateSort.direction, null)
  })
})
