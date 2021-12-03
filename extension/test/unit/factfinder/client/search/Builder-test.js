const Builder = require('../../../../../lib/factfinder/client/search/Builder')
const assert = require('assert')
const {factFinderConfig} = require('../../../config')

describe('FactFinderClientSearchBuilder', function () {
  it('should build simple query object', function () {
    const request = new Builder().query('my search text').channel(factFinderConfig.channel).build()

    assert.deepStrictEqual(request,
      {
        query: 'my search text',
        channel: factFinderConfig.channel,
        page: 1,
        filters: [],
        sortItems: []
      })
  })

  it('should build complex query object', function () {
    // for change
    const builder = new Builder()
    const request = builder.query('my search text').channel(factFinderConfig.channel).build()

    assert.deepStrictEqual(request,
      {
        query: 'my search text',
        channel: factFinderConfig.channel,
        page: 1,
        filters: [],
        sortItems: []
      })
  })
})
