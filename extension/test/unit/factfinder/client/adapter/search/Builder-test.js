const Builder = require('../../../../../../lib/factfinder/client/search/Builder')
const assert = require('assert')
const describe = require('mocha/decribe')
const it = require('mocha/it')

describe('FactFinderClientSearchBuilder', function () {
  it('should build array of strings', function () {
    const request = new Builder().query('my search text').channel('de').build()

    assert.deepStrictEqual(request,
      [
        [ 'format', 'json' ],
        [ 'query', 'my%20search%20text' ],
        [ 'channel', 'de' ]
      ])
  })
})
