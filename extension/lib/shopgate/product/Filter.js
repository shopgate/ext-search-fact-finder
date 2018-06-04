
const SHOPGATE_FILTER_TYPE_SINGLE = 'single_select'
const SHOPGATE_FILTER_TYPE_MULTI = 'multiselect'
const SHOPGATE_FILTER_TYPE_RANGE = 'range'

class ShopgateProductFilter {
  static createSingleSelect (id, label, values) {
    return shopgateProductFilterSelect(id, label, values, SHOPGATE_FILTER_TYPE_SINGLE)
  }

  static createMultiSelect (id, label, values) {
    return shopgateProductFilterSelect(id, label, values, SHOPGATE_FILTER_TYPE_MULTI)
  }

  static createRange (id, label, minimum, maximum) {
    return shopgateProductFilterRange(id, label, minimum, maximum)
  }

  static fromObject (id, object) {
    if (!object.type) {
      return null
    }

    const {type, label, minimum, maximum, values} = object

    let filter = shopgateProductFilterSelect(id, label, values, type)
    if (type === SHOPGATE_FILTER_TYPE_RANGE) {
      filter = shopgateProductFilterSelect(id, label, minimum, maximum, type)
    }

    return filter
  }
}

function shopgateProductFilterSelect (id, label, values, type) {
  return {
    id,
    label,
    values,
    type
  }
}

function shopgateProductFilterRange (id, label, minimum, maximum) {
  return {
    id,
    label,
    maximum,
    minimum,
    type: 'range'
  }
}

module.exports = ShopgateProductFilter
