const assert = require('assert')
const { filterDecodeValueFromSearchParams, filterPrepareValueForSearchParams } = require('../../../../../lib/factfinder/client/search/filter')

describe('FactFinderClientSearchFilter', function () {
  describe('filterDecodeValueFromSearchParams', function () {
    it('should provide a filter value from search params', function () {
      const searchParams = [
        {
          filters: [
            {
              'name': 'PREIS',
              'substring': true,
              'values': [
                {
                  'type': 'or',
                  'exclude': false,
                  'value': '[17.9, 30)'
                }
              ]
            },
            {
              'name': 'MARKE',
              'substring': true,
              'values': [
                {
                  'type': 'or',
                  'exclude': false,
                  'value': 'Intenso'
                }
              ]
            }
          ]
        }
      ]
      const expectedPricesFilterValue = [
        '>17.9'
      ]

      assert.deepStrictEqual(expectedPricesFilterValue.length, searchParams.length, 'The test is not correctly prepared, expectedFilterValue values and search param values must be of equal size')

      let counter = searchParams.length
      while (counter--) {
        assert.deepStrictEqual(filterDecodeValueFromSearchParams('PREIS', searchParams[counter]), expectedPricesFilterValue[counter])
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
