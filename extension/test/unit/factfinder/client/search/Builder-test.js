const Builder = require('../../../../../lib/factfinder/client/search/Builder')
const assert = require('assert')
const { describe, it } = require('mocha')

describe('FactFinderClientSearchBuilder', function () {
  it('should build array of strings', function () {
    const request = new Builder().query('my search text').channel('de').build()

    assert.deepStrictEqual(request,
      {
        query: 'my search text',
        channel: 'de',
        page: 1,
        filters: []
      })
  })
})
