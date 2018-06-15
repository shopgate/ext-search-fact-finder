const assert = require('assert')
const { filterDecodeValueFromSearchParams, filterPrepareValueForSearchParams } = require('../../../../../lib/factfinder/client/search/filter')

describe('FactFinderClientSearchFilter', function () {
  describe('filterDecodeValueFromSearchParams', function () {
    it('should provide a filter value from search params', function () {
      const searchParams = [
        '/fact-finder/Search.ff?query=raspberry&filterPREIS=%3C+5.00&channel=de&followSearch=9998&format=JSON',
        '/fact-finder/Search.ff?query=raspberry&filterPREIS=5.00+-+7.49&channel=de&followSearch=9998&format=JSON',
        '/fact-finder/Search.ff?query=raspberry&filterPREIS=7.50+-+9.99&channel=de&followSearch=9998&format=JSON',
        '/fact-finder/Search.ff?query=raspberry&filterPREIS=10.00+-+49.99&channel=de&followSearch=9998&format=JSON',
        '/fact-finder/Search.ff?query=raspberry&filterPREIS=50.00+-+74.99&channel=de&followSearch=9998&format=JSON',
        '/fact-finder/Search.ff?query=raspberry&filterPREIS=%3E%3D+75.00&channel=de&followSearch=9998&format=JSON'
      ]
      const expectedFilterValue = [
        '<+5.00',
        '5.00+-+7.49',
        '7.50+-+9.99',
        '10.00+-+49.99',
        '50.00+-+74.99',
        '>=+75.00'
      ]

      assert.deepStrictEqual(expectedFilterValue.length, searchParams.length, 'The test is not correctly prepared, expectedFilterValue values and search param values must be of equal size')

      let counter = searchParams.length
      while (counter--) {
        assert.deepStrictEqual(filterDecodeValueFromSearchParams('PREIS', searchParams[counter]), expectedFilterValue[counter])
      }
    })

    it('should return null when filter is not available', function () {
      assert.strictEqual(filterDecodeValueFromSearchParams('PREIS', ''), null)
    })
  })

  describe('filterPrepareValueForSearchParams', function () {
    it('should provide a filter name and value usable in applying filter', function () {
      assert.deepStrictEqual(
        filterPrepareValueForSearchParams(
          'PREIS',
          [
            '5.00+-+7.49',
            '7.50+-+9.99'
          ]),
        {
          filterName: 'filterPREIS',
          filterValue: '5.00+-+7.49~~~7.50+-+9.99'
        })
    })
  })
})
