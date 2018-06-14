const SORT_PRICE_ASCENDING = 'priceAsc'
const SORT_PRICE_DESCENDING = 'priceDesc'
const SORT_RELEVANCE = 'relevance'

const supportedSorts = [
  SORT_PRICE_ASCENDING,
  SORT_PRICE_DESCENDING,
  SORT_RELEVANCE
]

class ShopgateProductSearchSort {
  /**
   * @param {string} sort
   */
  constructor (sort) {
    this._sort = sort
    this.priceAsc = SORT_PRICE_ASCENDING
    this.priceDesc = SORT_PRICE_DESCENDING
    this.relevance = SORT_RELEVANCE
    this._checkDirectionAndFieldName()
  }

  _checkDirectionAndFieldName () {
    this._direction = null
    const matches = this._sort.match(/(asc|desc)$/i)
    if (matches) {
      this._direction = matches[1]
    }

    this._fieldName = 'relevance'
    if (this._direction !== null) {
      this._fieldName = 'price'
    }
  }

  /**
   * @returns {ShopgateProductSearchSort}
   */
  static get random () {
    return new ShopgateProductSearchSort(supportedSorts[Math.floor(Math.random() * supportedSorts.length)])
  }

  /**
   * @param {string} sort
   * @returns {ShopgateProductSearchSort|null}
   */
  static create (sort) {
    if (!this.supported(sort)) {
      return null
    }

    return new ShopgateProductSearchSort(sort)
  }

  /**
   * @param {string} sort
   * @returns {boolean}
   */
  static supported (sort) {
    return supportedSorts.indexOf(sort) !== -1
  }

  get direction () {
    return this._direction
  }

  get fieldName () {
    return this._fieldName
  }
}

module.exports = ShopgateProductSearchSort
